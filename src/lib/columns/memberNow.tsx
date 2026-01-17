import {buildBaseColumns, ColumnSchema} from "@/columns/buildBaseColumns";
import {MemberParsed} from "@/models/members";
import {CHARACTER_OPTIONS, HOBBY_OPTIONS, SKILL_OPTIONS, TALENT_OPTIONS} from "@/constants/options";
import {DropdownCell} from "@/components/table/DropdownCell";
import {ItemIcon} from "@/components/item/ItemIcon";

export function buildMemberNowColumns(t: any): ColumnSchema<MemberParsed> {
  return buildBaseColumns([
    // ===== CORE (flat fields) =====
    {
      key: 'name',
      labelKey: t.member.fields.name,
      input: 'text',
      get: m => m.person.name,
      set: (m, v) => ({
        ...m,
        person: {...m.person, name: v},
      }),
    },
    {
      key: 'character',
      labelKey: t.member.fields.character,
      width: '80px',
      get: m => m.character,
      set: (m, v) => ({...m, character: Number(v)}),
      render: (m, update) => (
        <DropdownCell
          value={m.character}
          options={CHARACTER_OPTIONS}
          labels={t.member.options.character}
          onChange={v =>
            update(m => ({
              ...m,
              character: v,
            }))
          }
        />
      ),
    },
    {
      key: 'age',
      labelKey: t.member.fields.age,
      input: 'text',
      width: '50px',
      get: m => m.age,
      set: (m, v) => ({...m, age: Number(v)}),
    },
    {
      key: 'literary',
      labelKey: t.member.fields.literary,
      input: 'text',
      width: '50px',
      get: m => m.literary,
      set: (m, v) => ({...m, literary: Number(v)}),
      maxValue: 100
    },
    {
      key: 'martial',
      labelKey: t.member.fields.martial,
      input: 'text',
      width: '50px',
      get: m => m.martial,
      set: (m, v) => ({...m, martial: Number(v)}),
      maxValue: 100
    },
    {
      key: 'business',
      labelKey: t.member.fields.business,
      input: 'text',
      width: '50px',
      get: m => m.business,
      set: (m, v) => ({...m, business: Number(v)}),
      maxValue: 100
    },
    {
      key: 'art',
      labelKey: t.member.fields.art,
      input: 'text',
      width: '50px',
      get: m => m.art,
      set: (m, v) => ({...m, art: Number(v)}),
      maxValue: 100
    },
    /* ================= SKILLS ================= */
    {
      key: 'skills',
      labelKey: t.member.fields.skills,
      width: '80px',
      get: m => m.person.skills,
      set: (m, v) => ({
        ...m,
        person: {...m.person, skills: Number(v)},
      }),
      render: (member, update) => (
        <DropdownCell
          value={member.person.skills}
          options={SKILL_OPTIONS}
          labels={t.member.options.skill}
          onChange={v =>
            update(m => ({
              ...m,
              person: {...m.person, skills: v},
            }))
          }
        />
      ),
    },
    {
      key: 'skillPos',
      labelKey: t.member.fields.skillPos,
      input: 'text',
      width: '50px',
      get: m => m.skillPos,
      set: (m, v) => ({...m, skillPos: Number(v)}),
      maxValue: 100
    },

    // {
    //   key: 'generation',
    //   labelKey: t.member.fields.Gen,
    //   input: 'text',
    //   get: m => m.person.generation,
    //   set: (m, v) => ({
    //     ...m,
    //     person: {...m.person, generation: Number(v)},
    //   }),
    // },
    /* ================= TALENT ================= */
    {
      key: 'talent',
      labelKey: t.member.fields.talent,
      width: '80px',
      get: m => m.person.talent,
      set: (m, v) => ({
        ...m,
        person: {...m.person, talent: Number(v)},
      }),
      render: (member, update) => (
        <DropdownCell
          value={member.person.talent}
          options={TALENT_OPTIONS}
          labels={t.member.options.talent}
          onChange={v =>
            update(m => ({
              ...m,
              person: {...m.person, talent: v},
            }))
          }
        />
      ),
    },
    {
      key: 'talentPos',
      labelKey: t.member.fields.talentPos,
      input: 'text',
      width: '50px',
      get: m => m.person.talentPos,
      set: (m, v) => ({
        ...m,
        person: {...m.person, talentPos: Number(v)},
      }),
      maxValue: 100
    },
    // {
    //   key: 'gender',
    //   labelKey: t.member.fields.gender,
    //   input: 'text',
    //   get: m => m.person.gender,
    //   set: (m, v) => ({
    //     ...m,
    //     person: {...m.person, gender: Number(v)},
    //     equipment: {...m.equipment, jewelryId: null},
    //   }),
    // },
    // {
    //   key: 'lifespan',
    //   labelKey: t.member.fields.lifespan,
    //   input: 'text',
    //   get: m => m.person.lifespan,
    //   set: (m, v) => ({
    //     ...m,
    //     person: {...m.person, lifespan: Number(v)},
    //   }),
    // },

    {
      key: 'luck',
      labelKey: t.member.fields.luck,
      input: 'text',
      width: '50px',
      get: m => m.person.luck,
      set: (m, v) => ({
        ...m,
        person: {...m.person, luck: Number(v)},
      }),
      maxValue: 100
    },
    /* ================= HOBBY ================= */
    {
      key: 'hobby',
      labelKey: t.member.fields.hobby,
      width: '80px',
      get: m => m.person.hobby,
      set: (m, v) => ({
        ...m,
        person: {...m.person, hobby: Number(v)},
      }),
      render: (member, update) => (
        <DropdownCell
          value={member.person.hobby}
          options={HOBBY_OPTIONS}
          labels={t.member.options.hobby}
          onChange={v =>
            update(m => ({
              ...m,
              person: {...m.person, hobby: v},
            }))
          }
        />
      ),
    },

    {
      key: 'mood',
      labelKey: t.member.fields.mood,
      input: 'text',
      width: '50px',
      get: m => m.mood,
      set: (m, v) => ({...m, mood: String(v)}),
      maxValue: 100
    },
    {
      key: 'merits',
      labelKey: t.member.fields.merits,
      width: '100px',
      get: m => m.merits,
      set: (m, v) => ({...m, merits: Number(v)}),
      render: (member, update) => {
        const meritLabels =
          (t.member.options?.merits ?? {}) as Record<string, string>

        // value(number) -> labelKey(string)
        const meritOptions: Record<number, string> = {}
        Object.keys(meritLabels).forEach((key, index) => {
          meritOptions[index] = key
        })

        return (
          <DropdownCell
            value={member.merits ?? 0}
            options={meritOptions}
            labels={meritLabels}
            maxWidth={100}
            onChange={v =>
              update(m => ({
                ...m,
                merits: v,
              }))
            }
          />
        )
      },
    },

    // {
    //   key: 'status',
    //   labelKey: t.member.fields.status,
    //   input: 'text',
    //   get: m => m.status,
    //   set: (m, v) => ({...m, status: Number(v)}),
    // },
    {
      key: 'reputation',
      labelKey: t.member.fields.reputation,
      input: 'text',
      width: '50px',
      get: m => m.reputation,
      set: (m, v) => ({...m, reputation: Number(v)}),
      maxValue: 100
    },
    {
      key: 'charm',
      labelKey: t.member.fields.charm,
      input: 'text',
      width: '50px',
      get: m => m.charm,
      set: (m, v) => ({...m, charm: Number(v)}),
      maxValue: 100
    },
    {
      key: 'health',
      labelKey: t.member.fields.health,
      input: 'text',
      width: '50px',
      get: m => m.health,
      set: (m, v) => ({...m, health: Number(v)}),
      maxValue: 100
    },
    {
      key: 'strategy',
      labelKey: t.member.fields.strategy,
      input: 'text',
      width: '50px',
      get: m => m.strategy,
      set: (m, v) => ({...m, strategy: Number(v)}),
      maxValue: 100
    },
    // {
    //   key: 'maritalStatus',
    //   labelKey: 'marital',
    //   input: 'text',
    //   get: m => m.maritalStatus,
    //   set: (m, v) => ({...m, maritalStatus: Number(v)}),
    // },
    {
      key: 'stamina',
      labelKey: t.member.fields.stamina,
      input: 'text',
      width: '50px',
      get: m => m.stamina,
      set: (m, v) => ({...m, stamina: Number(v)}),
      maxValue: 100
    },

    // ===== EQUIPMENT =====
    {
      key: 'weaponId',
      labelKey: t.member.fields.weapon ?? 'Weapon',
      width: '60px',
      get: m => m.equipment.weaponId,
      set: (m, v) => ({
        ...m,
        equipment: {...m.equipment, weaponId: Number(v)},
      }),
      render: (member, update) => {
        const weaponLabels =
          (t['group-items'][0]?.WEAPONS ?? {}) as Record<string, string>

        const weaponOptions: Record<number, string> = {}
        Object.keys(weaponLabels).forEach(k => {
          weaponOptions[Number(k)] = k
        })

        return (
          <DropdownCell
            value={member.equipment.weaponId ?? 0}
            options={weaponOptions}
            onChange={v =>
              update(m => ({
                ...m,
                equipment: { ...m.equipment, weaponId: v },
              }))
            }
            maxWidth={60}
            renderValue={v => <ItemIcon id={String(v)} size={20} />}
            renderOption={v => (
              <div className="d-flex align-items-center gap-2">
                <ItemIcon id={String(v)} size={20} />
                <span>{weaponLabels[String(v)]}</span>
              </div>
            )}

            hoverLabel={weaponLabels[String(member.equipment.weaponId ?? 0)]}
          />
        )
      }
    },
    {
      key: 'jewelryId',
      labelKey: t.member.fields.jewelry ?? 'Jewelry',
      width: '60px',
      get: m => m.equipment.jewelryId,
      set: (m, v) => ({
        ...m,
        equipment: {...m.equipment, jewelryId: Number(v)},
      }),
      render: (member, update) => {
        const allJewelry =
          (t['group-items'][0]?.JEWELLERY ?? {}) as Record<string, string>

        const filteredOptions: Record<number, string> = {}
        Object.entries(allJewelry).forEach(([key, label]) => {
          if (
            (member.person.gender === 0 && label.includes('(Nữ)')) ||
            (member.person.gender === 1 && label.includes('(Nam)'))
          ) {
            filteredOptions[Number(key)] = key
          }
        })

        return (
          <DropdownCell
            value={member.equipment.jewelryId ?? 0}
            options={filteredOptions}
            onChange={v =>
              update(m => ({
                ...m,
                equipment: {...m.equipment, jewelryId: v},
              }))
            }
            maxWidth={60}
            renderValue={v => <ItemIcon id={String(v)} size={20} />}
            renderOption={v => (
              <div className="d-flex align-items-center gap-2">
                <ItemIcon id={String(v)} size={20} />
                <span>{allJewelry[String(v)]}</span>
              </div>
            )}
            hoverLabel={allJewelry[String(member.equipment.jewelryId ?? 0)]}
          />
        )
      }
    },
    {
      key: 'talismanId',
      labelKey: t.member.fields.talisman ?? 'Talisman',
      width: '60px',
      get: m => m.equipment.talismanId,
      set: (m, v) => ({
        ...m,
        equipment: {...m.equipment, talismanId: Number(v)},
      }),
      render: (member, update) => {
        const spellLabels =
          (t['group-items'][0]?.SPELL ?? {}) as Record<string, string>

        const spellOptions: Record<number, string> = {}
        Object.keys(spellLabels).forEach(k => {
          spellOptions[Number(k)] = k
        })

        return (
          <DropdownCell
            value={member.equipment.talismanId ?? 0}
            options={spellOptions}
            onChange={v =>
              update(m => ({
                ...m,
                equipment: {...m.equipment, talismanId: v},
              }))
            }
            maxWidth={60}
            renderValue={v => <ItemIcon id={String(v)} size={20} />}
            renderOption={v => (
              <div className="d-flex align-items-center gap-2">
                <ItemIcon id={String(v)} size={20} />
                <span>{spellLabels[String(v)]}</span>
              </div>
            )}
            hoverLabel={spellLabels[String(member.equipment.talismanId ?? 0)]}
          />
        )
      }
    },
  ])
}
