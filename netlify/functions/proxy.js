function renderWarTable() {
      document.getElementById('table-title').innerText = "Faction War Telemetry & Respect Summary";
      document.getElementById('table-subtitle').innerText = "Attacks, hits, bleed count, respect gained, and respect lost";

      document.getElementById('table-header').innerHTML = `
        <th class="py-3 px-6">Member Name / ID</th>
        <th class="py-3 px-6">Total Hits</th>
        <th class="py-3 px-6 text-emerald-400">Respect Gained</th>
        <th class="py-3 px-6 text-amber-400">Bleed (Hit by Enemy)</th>
        <th class="py-3 px-6 text-rose-400">Bleed Respect Lost</th>
      `;

      const tableBody = document.getElementById('roster-table');
      tableBody.innerHTML = '';

      if (allMembers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="py-6 text-center text-slate-500">No member data available.</td></tr>';
        return;
      }

      const stats = {};
      allMembers.forEach(m => {
        stats[m.id] = { name: m.name, hits: 0, respectGained: 0, bleedCount: 0, bleedRespect: 0 };
      });

      // Handle Torn API v2 attack array structures safely
      const attacksList = Array.isArray(factionAttacks) ? factionAttacks : (factionAttacks.attacks || Object.values(factionAttacks));
      
      attacksList.forEach(atk => {
        // v2 properties can be nested under attacker/defender objects or IDs
        const attackerId = atk.attacker?.id || atk.attacker_id || atk.attacker;
        const defenderId = atk.defender?.id || atk.defender_id || atk.defender;
        const respectVal = Number(atk.respect || atk.respect_gain || atk.respect_loss || 0);

        if (stats[attackerId]) {
          stats[attackerId].hits++;
          stats[attackerId].respectGained += respectVal;
        }
        if (stats[defenderId]) {
          stats[defenderId].bleedCount++;
          stats[defenderId].bleedRespect += respectVal;
        }
      });

      Object.values(stats).forEach(s => {
        tableBody.innerHTML += `
          <tr class="hover:bg-slate-800/40 transition-colors">
            <td class="py-4 px-6 font-medium text-slate-200">${s.name}</td>
            <td class="py-4 px-6 font-mono text-indigo-400">${s.hits}</td>
            <td class="py-4 px-6 font-mono text-emerald-400">+${s.respectGained.toFixed(2)}</td>
            <td class="py-4 px-6 font-mono text-amber-400">${s.bleedCount}</td>
            <td class="py-4 px-6 font-mono text-rose-400">-${s.bleedRespect.toFixed(2)}</td>
          </tr>
        `;
      });
    }
