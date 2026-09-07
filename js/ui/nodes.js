/* Deep Jungle — node resolution screens: battles, camps, treasure, shrines, events, merchants, traps. */
(function (root) {
  const DJ = (root.DJ = root.DJ || {});
  const UI = (DJ.UI = DJ.UI || {});
  const N = (UI.Nodes = {});

  function panel(title, sub, iconId, bodyFn, actions) {
    UI.$('#nodeTitle').textContent = title;
    UI.$('#nodeSub').textContent = sub || '';
    const ic = UI.$('#nodeIcon');
    const g = ic.getContext('2d');
    g.clearRect(0, 0, ic.width, ic.height);
    g.imageSmoothingEnabled = false;
    if (iconId && DJ.SPRITES[iconId]) UI.spriteInto(ic, iconId, 3);
    else DJ.drawMissing(g, 4, 4, 64, 64, '?');
    const body = UI.$('#nodeBody');
    body.innerHTML = '';
    if (bodyFn) bodyFn(body);
    const act = UI.$('#nodeActions');
    act.innerHTML = '';
    (actions || []).forEach((a) => {
      if (!a) return;
      const b = UI.el('button', a.cls || 'choice-btn');
      b.type = 'button';
      b.appendChild(UI.el('div', 'c-label', a.label));
      if (a.desc) b.appendChild(UI.el('div', 'c-desc', a.desc));
      b.disabled = !!a.disabled;
      b.addEventListener('click', () => { DJ.sfx(a.sfx || 'click'); a.fn(); });
      act.appendChild(b);
    });
    UI.show('node');
  }
  N.panel = panel;

  function continueBtn(label) {
    return { label: label || 'Continue', cls: 'choice-btn', sfx: 'confirm', fn: () => N.finish() };
  }

  N.finish = function () {
    const run = DJ.run;
    run.completeNode();
    DJ.afterNode();
  };

  // ---------------- entry ----------------
  N.enter = function (node) {
    const run = DJ.run;
    const rng = run.rng;
    switch (node.type) {
      case 'battle': case 'elite': case 'boss': case 'heart': return startBattle(node);
      case 'rest': return rest(node);
      case 'treasure': return treasure(node);
      case 'shrine': return shrine(node);
      case 'merchant': return merchant(node);
      case 'event': return storyEvent(node);
      case 'puzzle': return UI.Puzzles.start(node, (solved) => puzzleResult(node, solved));
      case 'training': return training(node);
      case 'trap': return trap(node);
      case 'mystery': return mystery(node);
      default: return N.finish();
    }
  };

  // ---------------- battles ----------------
  function startBattle(node, enemiesOverride, afterFn) {
    const run = DJ.run;
    const enemies = enemiesOverride || DJ.buildEncounter(run.rng, node);
    UI.Battle.start(node, enemies, (won, battle) => {
      DJ.recordBattle(battle, run);
      if (!won) { DJ.runLost(); return; }
      run.stats.battles++;
      if (node.type === 'elite') run.stats.elites++;
      if (node.type === 'boss' || node.type === 'heart') run.stats.bosses++;
      const rew = battle.rewards();
      const gains = run.applyBattleRewards(rew);
      const drops = run.battleDrops(node);
      run.applyLoot(drops);
      for (const it of drops.items || []) { DJ.bump('itemsFound'); if (it.rarity === 'epic') DJ.bump('epicsFound'); }
      DJ.bump('goldEarned', rew.gold);
      run.postBattleRecovery();
      if (afterFn) { afterFn(); return; }
      showVictory(node, rew, gains, drops);
    });
  }
  N.startBattle = startBattle;

  function showVictory(node, rew, gains, drops) {
    const run = DJ.run;
    const isFinal = node.type === 'heart';
    UI.$('#resultTitle').textContent = isFinal ? 'THE JUNGLE IS STILL' : 'Victory';
    UI.$('#resultTitle').className = 'win';
    const body = UI.$('#resultBody');
    body.innerHTML = '';
    if (isFinal) {
      const p = UI.el('p', 'muted');
      p.style.cssText = 'font-style:italic;line-height:1.6;margin-bottom:14px';
      p.textContent = 'The Heart splits, and every vine in the jungle goes slack at once. For the first time in a very long time, the deep green is quiet.';
      body.appendChild(p);
    }
    const rl = UI.el('div', 'reward-line');
    rl.innerHTML = `<b>+${rew.xp}</b> XP    <b>+${rew.gold}</b> gold`;
    body.appendChild(rl);
    for (const g of gains) {
      const c = UI.el('div', 'levelup-card');
      c.appendChild(UI.el('div', 'lu-head', `${g.unit.name} reached level ${g.level}!`));
      const d = g.delta;
      c.appendChild(UI.el('div', 'lu-stats', `+${d.hp} HP  +${d.mp} MP  +${d.atk} ATK  +${d.mag} MAG  +${d.def} DEF  +${d.spd} SPD`));
      for (const sid of g.newSkills) {
        const sk = DJ.SKILLS[sid];
        if (sk) c.appendChild(UI.el('div', 'lu-skill', `New skill: ${sk.name} — ${sk.desc}`));
      }
      body.appendChild(c);
    }
    if (gains.length) DJ.sfx('levelup', 0.35);
    if (drops && (drops.items.length || drops.potions.length)) {
      body.appendChild(UI.el('h4', null, 'Spoils')).style.cssText = 'margin:14px 0 8px;font-size:14px';
      for (const it of drops.items) body.appendChild(UI.itemLine(it));
      const counts = {};
      for (const p of drops.potions) counts[p] = (counts[p] || 0) + 1;
      for (const p in counts) body.appendChild(UI.potionLine(p, counts[p]));
      DJ.sfx('gold', 0.2);
    }
    const acts = UI.$('#resultActions');
    acts.innerHTML = '';
    if (isFinal) {
      const b = UI.el('button', 'choice-btn');
      b.appendChild(UI.el('div', 'c-label', 'Leave the jungle'));
      b.addEventListener('click', () => { DJ.sfx('confirm'); DJ.runWon(); });
      acts.appendChild(b);
    } else {
      const b = UI.el('button', 'choice-btn');
      b.appendChild(UI.el('div', 'c-label', 'Onward'));
      b.addEventListener('click', () => { DJ.sfx('confirm'); N.finish(); });
      acts.appendChild(b);
      const g = UI.el('button', 'choice-btn');
      g.appendChild(UI.el('div', 'c-label', 'Manage party'));
      g.appendChild(UI.el('div', 'c-desc', 'Equip gear, check skills.'));
      g.addEventListener('click', () => { DJ.sfx('click'); UI.Panels.party(); });
      acts.appendChild(g);
    }
    UI.show('result');
    DJ.checkAndAnnounce();
  }

  // ---------------- camp ----------------
  function rest(node) {
    const run = DJ.run;
    const final = !!node.finalCamp;
    panel(final ? 'The Last Camp' : 'Campfire',
      final ? 'Beyond this clearing, the Heart waits.' : 'A safe clearing. For now.',
      'node_rest',
      (body) => {
        const p = UI.el('p', 'flavor');
        p.textContent = final
          ? 'Someone built this fire ring a long time ago and never came back for it. You stack the wood anyway. The jungle beyond the clearing has gone very quiet, the way it does before something enormous moves.'
          : 'You clear a patch of ferns and build a small fire. Insects the size of your thumb orbit the flames. The jungle breathes around you, and for a few hours it does not try to kill anyone.';
        body.appendChild(p);
        if (final) {
          const q = UI.el('p');
          q.innerHTML = 'You empty your packs and pool what is left. <b>Emergency supplies are shared out.</b>';
          body.appendChild(q);
        }
      },
      final ? [{
        label: 'Rest, resupply, and face the Heart', desc: 'Fully restore the party and receive supplies.', sfx: 'shrine',
        fn: () => {
          const res = run.restHeal(1.0);
          const given = run.finalCampSupplies();
          run.stats.rests++;
          DJ.bump('rests');
          showRestResult(res, given);
        },
      }] : [
        { label: 'Rest by the fire', desc: 'Restore 75% HP and MP, cure all ailments, revive fallen heroes.', sfx: 'shrine',
          fn: () => { const res = run.restHeal(0.75); run.stats.rests++; DJ.bump('rests'); showRestResult(res, null); } },
        { label: 'Train instead', desc: 'Skip the rest; the whole party gains XP.', sfx: 'confirm',
          fn: () => {
            const gains = [];
            for (const h of run.party) gains.push(...DJ.grantXp(h, Math.round(24 + node.level * 11)));
            showTrainResult(gains);
          } },
        { label: 'Forage', desc: 'Search the clearing for potions and a little gold.', sfx: 'open',
          fn: () => {
            const loot = { gold: 12 + node.level * 4, potions: [DJ.rollPotion(run.rng)] };
            if (run.rng.chance(0.4)) loot.potions.push(DJ.rollPotion(run.rng));
            run.applyLoot(loot);
            DJ.bump('goldEarned', loot.gold);
            run.restHeal(0.25);
            showLoot('Foraged', loot);
          } },
      ]);
  }

  function showRestResult(res, given) {
    panel('Morning', 'The fire burns down to embers.', 'node_rest', (body) => {
      for (const r of res) {
        const line = UI.el('div', 'loot-row');
        line.appendChild(UI.spriteEl(r.unit.sprite, 1.6, r.unit.name));
        const info = UI.el('div');
        info.appendChild(UI.el('div', 'loot-name', r.unit.name));
        info.appendChild(UI.el('div', 'loot-stats',
          r.revived ? 'Back on their feet.' : `HP ${r.unit.hp}/${r.unit.maxHp}${r.unit.maxMp ? `   MP ${r.unit.mp}/${r.unit.maxMp}` : ''}`));
        line.appendChild(info);
        body.appendChild(line);
      }
      if (given && given.length) {
        body.appendChild(UI.el('h4', null, 'Supplies')).style.cssText = 'margin:14px 0 8px;font-size:14px';
        const counts = {};
        for (const g of given) counts[g] = (counts[g] || 0) + 1;
        for (const g in counts) body.appendChild(UI.potionLine(g, counts[g]));
      }
    }, [continueBtn()]);
    DJ.sfx('heal');
  }

  function showTrainResult(gains) {
    panel('Drills', 'Sore, but sharper.', 'node_training', (body) => {
      if (!gains.length) { body.appendChild(UI.el('p', 'flavor', 'The party practises forms until their arms ache. Progress is progress.')); return; }
      for (const g of gains) {
        const c = UI.el('div', 'levelup-card');
        c.appendChild(UI.el('div', 'lu-head', `${g.unit.name} reached level ${g.level}!`));
        const d = g.delta;
        c.appendChild(UI.el('div', 'lu-stats', `+${d.hp} HP  +${d.atk} ATK  +${d.mag} MAG  +${d.def} DEF  +${d.spd} SPD`));
        for (const sid of g.newSkills) { const sk = DJ.SKILLS[sid]; if (sk) c.appendChild(UI.el('div', 'lu-skill', `New skill: ${sk.name}`)); }
        body.appendChild(c);
      }
      DJ.sfx('levelup');
    }, [continueBtn()]);
  }

  // ---------------- treasure ----------------
  function treasure(node) {
    const run = DJ.run;
    panel('Treasure', `Level ${node.level} cache`, 'node_treasure', (body) => {
      body.appendChild(UI.el('p', 'flavor', 'Half-buried under a curtain of roots: a strongbox with someone else’s initials burned into the lid. They are not using it.'));
    }, [
      { label: 'Open it', desc: 'Take everything.', sfx: 'open', fn: () => {
        const loot = run.treasureLoot(node.level, 1);
        run.applyLoot(loot);
        run.stats.treasures++;
        DJ.bump('goldEarned', loot.gold);
        for (const it of loot.items) { DJ.bump('itemsFound'); if (it.rarity === 'epic') DJ.bump('epicsFound'); }
        showLoot('Opened', loot, true);
      } },
      { label: 'Pry off the lock plate', desc: 'Riskier: better odds of a fine item, but it may be trapped.', sfx: 'open', fn: () => {
        const loot = run.treasureLoot(node.level, 3);
        run.applyLoot(loot);
        run.stats.treasures++;
        DJ.bump('goldEarned', loot.gold);
        for (const it of loot.items) { DJ.bump('itemsFound'); if (it.rarity === 'epic') DJ.bump('epicsFound'); }
        const sprung = run.rng.chance(0.4);
        if (sprung) {
          for (const h of run.party) if (h.alive) h.hp = Math.max(1, h.hp - Math.round(h.maxHp * 0.16));
          DJ.bump('traps');
          DJ.sfx('trap');
        }
        showLoot(sprung ? 'Sprung — but opened' : 'Cracked it clean', loot, true, sprung ? 'A needle trap catches the whole party. Worth it, probably.' : null);
      } },
    ]);
  }

  function showLoot(title, loot, equipOffer, note) {
    const run = DJ.run;
    panel(title, null, 'node_treasure', (body) => {
      if (note) body.appendChild(UI.el('p', 'flavor', note));
      if (loot.gold) {
        const g = UI.el('div', 'reward-line');
        g.innerHTML = `<b>+${loot.gold}</b> gold`;
        body.appendChild(g);
      }
      for (const it of loot.items || []) {
        const btn = UI.el('button', 'btn small');
        btn.textContent = 'Equip';
        btn.addEventListener('click', () => { DJ.sfx('click'); UI.Panels.equipChooser(it); });
        body.appendChild(UI.itemLine(it, equipOffer ? btn : null));
      }
      const counts = {};
      for (const p of loot.potions || []) counts[p] = (counts[p] || 0) + 1;
      for (const p in counts) body.appendChild(UI.potionLine(p, counts[p]));
      if (!loot.gold && !(loot.items || []).length && !(loot.potions || []).length) {
        body.appendChild(UI.el('p', 'flavor', 'Empty. Someone got here first.'));
      }
    }, [continueBtn()]);
    DJ.sfx('gold');
  }

  // ---------------- shrine ----------------
  function shrine(node) {
    const run = DJ.run;
    const rng = run.rng;
    const options = rng.shuffle(DJ.BLESSINGS).slice(0, 3);
    panel('Jungle Shrine', 'Choose one blessing', 'node_shrine', (body) => {
      body.appendChild(UI.el('p', 'flavor', 'A carved stone face, furred with moss, set into the roots of a tree that grew around it. The eyes have been polished smooth by centuries of hopeful thumbs.'));
    }, options.map((bl) => ({
      label: bl.name + (bl.cost ? ` (${bl.cost} gold)` : ''),
      desc: bl.desc,
      disabled: bl.cost ? run.gold < bl.cost : false,
      sfx: 'shrine',
      fn: () => {
        if (bl.cost) { run.gold -= bl.cost; DJ.bump('goldSpent', bl.cost); }
        run.stats.shrines++;
        DJ.bump('shrines');
        if (bl.party) {
          for (const h of run.party) { for (const k in bl.apply) h.bonus[k] = (h.bonus[k] || 0) + bl.apply[k]; DJ.recalcHero(h); }
          showBlessing(bl, run.party);
        } else {
          UI.Panels.chooseHero('Bless which adventurer?', (h) => {
            for (const k in bl.apply) h.bonus[k] = (h.bonus[k] || 0) + bl.apply[k];
            DJ.recalcHero(h);
            showBlessing(bl, [h]);
          });
        }
      },
    })).concat([{ label: 'Leave the shrine alone', desc: 'Some faces are better left unbothered.', sfx: 'cancel', fn: () => N.finish() }]));
  }

  function showBlessing(bl, heroes) {
    panel('Blessed', bl.name, 'node_shrine', (body) => {
      body.appendChild(UI.el('p', 'flavor', 'Warmth spreads from the stone into your hands, then somewhere deeper.'));
      for (const h of heroes) {
        const row = UI.el('div', 'loot-row');
        row.appendChild(UI.spriteEl(h.sprite, 1.6, h.name));
        const info = UI.el('div');
        info.appendChild(UI.el('div', 'loot-name', h.name));
        info.appendChild(UI.el('div', 'loot-stats', Object.entries(bl.apply).map(([k, v]) => `${v > 0 ? '+' : ''}${v} ${k.toUpperCase()}`).join('  ')));
        row.appendChild(info);
        body.appendChild(row);
      }
    }, [continueBtn()]);
    DJ.sfx('shrine');
  }

  // ---------------- training ----------------
  function training(node) {
    const run = DJ.run;
    const xp = Math.round(30 + node.level * 14);
    panel('Training Ground', `Level ${node.level}`, 'node_training', (body) => {
      body.appendChild(UI.el('p', 'flavor', 'A flattened circle of earth ringed with practice posts, each hacked half to splinters. Someone trained here for years. The posts remember it.'));
    }, [
      { label: 'Focused drill', desc: `One adventurer gains ${Math.round(xp * 1.8)} XP.`, sfx: 'confirm', fn: () => {
        UI.Panels.chooseHero('Who trains?', (h) => {
          run.stats.trainings++; DJ.bump('trainings');
          showTrainResult(DJ.grantXp(h, Math.round(xp * 1.8)));
        });
      } },
      { label: 'Group sparring', desc: `The whole party gains ${xp} XP.`, sfx: 'confirm', fn: () => {
        run.stats.trainings++; DJ.bump('trainings');
        const gains = [];
        for (const h of run.party) gains.push(...DJ.grantXp(h, xp));
        showTrainResult(gains);
      } },
      { label: 'Strength conditioning', desc: 'One adventurer permanently gains +2 ATK and +2 DEF.', sfx: 'confirm', fn: () => {
        UI.Panels.chooseHero('Who conditions?', (h) => {
          h.bonus.atk += 2; h.bonus.def += 2; DJ.recalcHero(h);
          run.stats.trainings++; DJ.bump('trainings');
          showBlessing({ name: 'Conditioning', apply: { atk: 2, def: 2 } }, [h]);
        });
      } },
    ]);
  }

  // ---------------- trap ----------------
  function trap(node) {
    const run = DJ.run;
    const rng = run.rng;
    const kinds = [
      { name: 'Deadfall', text: 'A tripline you notice a half-second after your boot finds it. The log comes down out of the canopy like a judgement.', dmg: 0.16, status: null },
      { name: 'Spore Vent', text: 'The ground exhales. The cloud is warm, sweet, and extremely bad for you.', dmg: 0.07, status: 'poison' },
      { name: 'Thorn Pit', text: 'A lattice of woven leaves gives way. Below: sharpened stakes, black with old varnish.', dmg: 0.2, status: 'bleed' },
      { name: 'Snare Net', text: 'The net takes the whole party at once and hoists you into the dark for a while.', dmg: 0.09, status: 'slow' },
      { name: 'Ember Cache', text: 'A jar of something volatile, buried at ankle height, waiting for a century for exactly this.', dmg: 0.13, status: 'burn' },
    ];
    const k = rng.pick(kinds);
    panel('Trap: ' + k.name, 'Someone did not want visitors', 'node_trap', (body) => {
      body.appendChild(UI.el('p', 'flavor', k.text));
    }, [
      { label: 'Push through it', desc: 'Take the hit and keep going.', sfx: 'trap', fn: () => {
        for (const h of run.party) {
          if (!h.alive) continue;
          h.hp = Math.max(1, h.hp - Math.round(h.maxHp * k.dmg));
          if (k.status && rng.chance(0.6)) h.statuses.push({ id: k.status, turns: 2 });
        }
        run.stats.traps++; DJ.bump('traps');
        const loot = rng.chance(0.5) ? { gold: 16 + node.level * 5 } : null;
        if (loot) { run.applyLoot(loot); DJ.bump('goldEarned', loot.gold); }
        panel('Through it', null, 'node_trap', (body) => {
          body.appendChild(UI.el('p', 'flavor', 'Bruised, bleeding, and moving.'));
          if (loot) { const g = UI.el('div', 'reward-line'); g.innerHTML = `You find the trapper’s stash: <b>+${loot.gold}</b> gold.`; body.appendChild(g); }
          for (const h of run.party) if (h.alive) body.appendChild(UI.el('div', 'loot-desc', `${h.name}: ${h.hp}/${h.maxHp} HP`));
        }, [continueBtn()]);
        DJ.sfx('trap');
        UI.flash();
      } },
      { label: 'Disarm it carefully', desc: 'Takes time. Might work. Might not.', sfx: 'click', fn: () => {
        const ok = rng.chance(0.55);
        if (ok) {
          const loot = { gold: 24 + node.level * 7, potions: rng.chance(0.5) ? [DJ.rollPotion(rng)] : [] };
          run.applyLoot(loot); DJ.bump('goldEarned', loot.gold);
          showLoot('Disarmed', loot, false, 'You unpick the mechanism and salvage the parts. The trapper would be furious.');
        } else {
          for (const h of run.party) if (h.alive) h.hp = Math.max(1, h.hp - Math.round(h.maxHp * (k.dmg + 0.06)));
          run.stats.traps++; DJ.bump('traps');
          panel('It goes off', null, 'node_trap', (body) => {
            body.appendChild(UI.el('p', 'flavor', 'It goes off in your hands, which is worse than it going off under your feet.'));
            for (const h of run.party) if (h.alive) body.appendChild(UI.el('div', 'loot-desc', `${h.name}: ${h.hp}/${h.maxHp} HP`));
          }, [continueBtn()]);
          DJ.sfx('trap'); UI.flash();
        }
      } },
    ]);
  }

  // ---------------- merchant ----------------
  function merchant(node) {
    const run = DJ.run;
    if (!node._stock) node._stock = run.merchantStock();
    const stock = node._stock;
    run.stats.merchants++;
    if (!node._counted) { node._counted = true; DJ.bump('merchants'); }

    panel('Merchant', `${run.gold} gold`, 'node_merchant', (body) => {
      body.appendChild(UI.el('p', 'flavor', '"You look like people who lose things," says the trader, who is sitting on a crate in the middle of nowhere with a parasol. "Lucky for you, I find things."'));

      const mkBuy = (label, price, canAfford, onBuy) => {
        const b = UI.el('button', 'btn small' + (canAfford ? ' gold' : ''));
        b.textContent = `${price}g`;
        b.disabled = !canAfford;
        b.addEventListener('click', () => { DJ.sfx('gold'); onBuy(); });
        return b;
      };

      body.appendChild(UI.el('h4', null, 'Equipment')).style.cssText = 'margin:12px 0 8px;font-size:14px';
      if (!stock.items.length) body.appendChild(UI.el('p', 'empty-note', 'Sold out.'));
      stock.items.forEach((it, i) => {
        if (it._sold) return;
        const price = DJ.itemPrice(it);
        body.appendChild(UI.itemLine(it, mkBuy(it.name, price, run.gold >= price, () => {
          run.gold -= price; DJ.bump('goldSpent', price); DJ.bump('itemsFound');
          if (it.rarity === 'epic') DJ.bump('epicsFound');
          it._sold = true;
          run.addItem(it);
          UI.Panels.equipChooser(it, () => merchant(node));
        })));
      });

      body.appendChild(UI.el('h4', null, 'Potions')).style.cssText = 'margin:14px 0 8px;font-size:14px';
      stock.potions.forEach((pid) => {
        const p = DJ.POTIONS[pid];
        body.appendChild(UI.potionLine(pid, null, mkBuy(p.name, p.price, run.gold >= p.price, () => {
          run.gold -= p.price; DJ.bump('goldSpent', p.price);
          run.addPotion(pid, 1);
          merchant(node);
        })));
      });

      if (run.stash.length) {
        body.appendChild(UI.el('h4', null, 'Sell from your bag')).style.cssText = 'margin:14px 0 8px;font-size:14px';
        run.stash.slice().forEach((it) => {
          const price = Math.round(DJ.itemPrice(it) * 0.45);
          const b = UI.el('button', 'btn small');
          b.textContent = `Sell ${price}g`;
          b.addEventListener('click', () => { DJ.sfx('gold'); run.sellItem(it); DJ.bump('goldEarned', price); merchant(node); });
          body.appendChild(UI.itemLine(it, b));
        });
      }
    }, [
      { label: 'Manage party', desc: 'Equip what you bought.', sfx: 'click', fn: () => UI.Panels.party(() => merchant(node)) },
      continueBtn('Move on'),
    ]);
  }

  // ---------------- story events ----------------
  function storyEvent(node) {
    const run = DJ.run;
    const rng = run.rng;
    const pool = DJ.EVENTS.filter((e) => !run._seenEvents || !run._seenEvents[e.id]);
    const ev = rng.pick(pool.length ? pool : DJ.EVENTS);
    run._seenEvents = run._seenEvents || {};
    run._seenEvents[ev.id] = true;

    panel(ev.title, 'An encounter', 'node_event', (body) => {
      body.appendChild(UI.el('p', 'flavor', ev.text));
    }, ev.options.map((opt) => {
      let disabled = false, note = opt.desc;
      if (opt.cost && run.gold < opt.cost) { disabled = true; note = `${opt.desc} (you only have ${run.gold} gold)`; }
      if (opt.costPotion) {
        const has = opt.costPotion === 'any'
          ? Object.values(run.inventory).some((n) => n > 0)
          : (run.inventory[opt.costPotion] || 0) > 0;
        if (!has) { disabled = true; note = `${opt.desc} (you have none)`; }
      }
      return {
        label: opt.label, desc: note, disabled, sfx: 'confirm',
        fn: () => {
          if (opt.cost) { run.gold -= opt.cost; DJ.bump('goldSpent', opt.cost); }
          if (opt.costPotion) {
            const pid = opt.costPotion === 'any'
              ? Object.keys(run.inventory).find((k) => run.inventory[k] > 0)
              : opt.costPotion;
            if (pid) run.inventory[pid]--;
          }
          const oc = rng.weighted(opt.outcomes.map((o) => ({ v: o, w: o.w })));
          run.stats.events++;
          DJ.bump('events');
          applyOutcome(node, oc);
        },
      };
    }));
  }

  function applyOutcome(node, oc) {
    const run = DJ.run;
    const rng = run.rng;
    const lines = [];
    let battleTag = null;
    const gotItems = [], gotPotions = [];
    let gold = 0;

    for (const op of oc.ops) {
      if (op.heal) { for (const h of run.party) if (h.alive) h.hp = Math.min(h.maxHp, h.hp + Math.round(h.maxHp * op.heal)); lines.push(`The party recovers ${Math.round(op.heal * 100)}% HP.`); }
      if (op.mp) { for (const h of run.party) if (h.alive) h.mp = Math.min(h.maxMp, h.mp + Math.round(h.maxMp * op.mp)); lines.push(`The party recovers ${Math.round(op.mp * 100)}% MP.`); }
      if (op.damage) { for (const h of run.party) if (h.alive) h.hp = Math.max(1, h.hp - Math.round(h.maxHp * op.damage)); lines.push(`The party takes ${Math.round(op.damage * 100)}% damage.`); }
      if (op.status) { for (const h of run.party) if (h.alive) h.statuses.push({ id: op.status, turns: 2 }); lines.push(`The party is afflicted with ${(DJ.STATUS[op.status] || {}).name || op.status}.`); }
      if (op.gold) { const g = op.gold; run.gold = Math.max(0, run.gold + g); gold += g; if (g > 0) DJ.bump('goldEarned', g); }
      if (op.potion) { const pid = op.potion === 'random' ? DJ.rollPotion(rng) : op.potion; run.addPotion(pid, 1); gotPotions.push(pid); }
      if (op.item != null) { const it = DJ.rollItem(rng, node.level, op.item); run.addItem(it); gotItems.push(it); DJ.bump('itemsFound'); if (it.rarity === 'epic') DJ.bump('epicsFound'); }
      if (op.xp) { for (const h of run.party) DJ.grantXp(h, op.xp); lines.push(`Everyone gains ${op.xp} XP.`); }
      if (op.stat) {
        const st = op.stat.stat === 'random' ? rng.pick(['atk', 'mag', 'def', 'spd']) : op.stat.stat;
        const targets = op.stat.who === 'all' ? run.party : [rng.pick(run.party)];
        for (const h of targets) { h.bonus[st] = (h.bonus[st] || 0) + op.stat.amount; DJ.recalcHero(h); }
        lines.push(`${targets.map((h) => h.name).join(' and ')} permanently gains +${op.stat.amount} ${st.toUpperCase()}.`);
      }
      if (op.battle) battleTag = op.battle;
    }

    const showIt = () => {
      panel('…', null, 'node_event', (body) => {
        body.appendChild(UI.el('p', 'flavor', oc.text));
        if (gold > 0) { const g = UI.el('div', 'reward-line'); g.innerHTML = `<b>+${gold}</b> gold`; body.appendChild(g); }
        if (gold < 0) { const g = UI.el('div', 'reward-line'); g.innerHTML = `<b>${gold}</b> gold`; body.appendChild(g); }
        for (const l of lines) body.appendChild(UI.el('p', 'loot-desc', l));
        for (const it of gotItems) {
          const btn = UI.el('button', 'btn small');
          btn.textContent = 'Equip';
          btn.addEventListener('click', () => { DJ.sfx('click'); UI.Panels.equipChooser(it); });
          body.appendChild(UI.itemLine(it, btn));
        }
        const counts = {};
        for (const p of gotPotions) counts[p] = (counts[p] || 0) + 1;
        for (const p in counts) body.appendChild(UI.potionLine(p, counts[p]));
      }, [continueBtn()]);
      if (gotItems.length || gotPotions.length || gold > 0) DJ.sfx('gold');
    };

    if (battleTag) {
      panel('Ambush!', null, 'node_battle', (body) => {
        body.appendChild(UI.el('p', 'flavor', oc.text));
      }, [{ label: 'Fight', desc: 'No choice now.', sfx: 'roar', fn: () => {
        const enemies = DJ.buildNormalGroup(rng, node.level, node.region, battleTag === 'normal' ? null : battleTag);
        startBattle(node, enemies, showIt);
      } }]);
      return;
    }
    showIt();
  }

  // ---------------- puzzle result ----------------
  function puzzleResult(node, solved) {
    const run = DJ.run;
    if (solved) {
      const loot = run.treasureLoot(node.level, 2);
      run.applyLoot(loot);
      run.stats.puzzles++;
      DJ.bump('puzzlesSolved');
      DJ.bump('goldEarned', loot.gold);
      for (const it of loot.items) { DJ.bump('itemsFound'); if (it.rarity === 'epic') DJ.bump('epicsFound'); }
      showLoot('Solved', loot, true, 'Something old and patient decides you have earned it.');
      DJ.sfx('puzzle_ok');
    } else {
      for (const h of run.party) if (h.alive) h.hp = Math.max(1, h.hp - Math.round(h.maxHp * 0.09));
      panel('Wrong', 'The mechanism resets', 'node_puzzle', (body) => {
        body.appendChild(UI.el('p', 'flavor', 'The stone grinds shut. Something stings the back of your neck as you step away.'));
      }, [continueBtn()]);
      DJ.sfx('puzzle_fail');
    }
  }

  // ---------------- mystery ----------------
  function mystery(node) {
    const run = DJ.run;
    panel('Mystery', 'Something is here. Unclear what.', 'node_mystery', (body) => {
      body.appendChild(UI.el('p', 'flavor', 'The air goes strange, the way it does before weather or violence. The path ahead is hidden in a haze of drifting spores.'));
    }, [{ label: 'Step into it', desc: 'It could be anything.', sfx: 'magic', fn: () => {
      const inner = run.rng.weighted([
        { v: 'battle', w: 26 }, { v: 'treasure', w: 20 }, { v: 'event', w: 18 },
        { v: 'elite', w: 10 }, { v: 'shrine', w: 12 }, { v: 'rest', w: 8 }, { v: 'merchant', w: 6 },
      ]);
      const fake = Object.assign(Object.create(Object.getPrototypeOf(node)), node, { type: inner });
      // keep identity so completeNode() still targets the real node
      fake.id = node.id;
      UI.flash();
      setTimeout(() => N.enter(fake), 220);
    } }]);
  }
})(typeof window !== 'undefined' ? window : globalThis);
