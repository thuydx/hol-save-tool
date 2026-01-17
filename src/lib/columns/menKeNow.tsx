import {MenKeNowParsed} from '@/models/menKeNow'
import {buildBaseColumns, ColumnSchema} from "@/columns/buildBaseColumns";
import {DropdownCell} from "@/components/table/DropdownCell";
import {SKILL_OPTIONS, TALENT_OPTIONS} from "@/constants/options";

export function buildMenKeNowColumns(t: any): ColumnSchema<MenKeNowParsed> {
  return buildBaseColumns<MenKeNowParsed>([
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
      key: 'age',
      labelKey: t.member.fields.age,
      width: '40px',
      input: 'text',
      get: m => m.age,
      set: (m, v) => ({...m, age: Number(v)}),
      maxValue: 20
    },
    {
      key: 'literary',
      labelKey: t.member.fields.literary,
      width: '40px',
      input: 'text',
      get: m => m.literary,
      set: (m, v) => ({...m, literary: Number(v)}),
      maxValue: 100
    },
    {
      key: 'martial',
      labelKey: t.member.fields.martial,
      width: '40px',
      input: 'text',
      get: m => m.martial,
      set: (m, v) => ({...m, martial: Number(v)}),
      maxValue: 100
    },
    {
      key: 'business',
      labelKey: t.member.fields.business,
      width: '40px',
      input: 'text',
      get: m => m.business,
      set: (m, v) => ({...m, business: Number(v)}),
      maxValue: 100
    },
    {
      key: 'art',
      labelKey: t.member.fields.art,
      width: '40px',
      input: 'text',
      get: m => m.art,
      set: (m, v) => ({...m, art: Number(v)}),
      maxValue: 100
    },
    {
      key: 'luck',
      labelKey: t.member.fields.luck,
      input: 'text',
      width: '80px',
      get: m => m.person.luck,
      set: (m, v) => ({
        ...m,
        person: {...m.person, luck: Number(v)},
      }),
      maxValue: 100
    },
    {
      key: 'mood',
      labelKey: t.member.fields.mood,
      width: '80px',
      input: 'text',
      get: m => m.mood,
      set: (m, v) => ({...m, mood: Number(v)}),
      maxValue: 100
    },
    {
      key: 'reputation',
      labelKey: t.member.fields.reputation,
      width: '100px',
      input: 'text',
      get: m => m.reputation,
      set: (m, v) => ({...m, reputation: Number(v)}),
      maxValue: 100
    },
    {
      key: 'charm',
      labelKey: t.member.fields.charm,
      width: '80px',
      input: 'text',
      get: m => m.charm,
      set: (m, v) => ({...m, charm: Number(v)}),
      maxValue: 100
    },
    {
      key: 'health',
      labelKey: t.member.fields.health,
      width: '80px',
      input: 'text',
      get: m => m.health,
      set: (m, v) => ({...m, health: Number(v)}),
      maxValue: 100
    },
    // {
    //   key: 'strategy',
    //   labelKey: t.member.fields.strategy,
    //   width: '40px',
    //   input: 'text',
    //   get: m => m.strategy,
    //   set: (m, v) => ({...m, strategy: Number(v)}),
    //   maxValue: 100
    // },
    {
      key: 'stamina',
      labelKey: t.member.fields.stamina,
      width: '80px',
      input: 'text',
      get: m => m.stamina,
      set: (m, v) => ({...m, stamina: Number(v)}),
      maxValue: 50
    },
    {
      key: 'skill',
      labelKey: t.member.fields.skills,
      width: '80px',
      get: m => m.person.skill,
      set: (m, v) => ({
        ...m,
        person: {...m.person, skill: Number(v)},
      }),
      render: (member, update, t) => (
        <DropdownCell
          value={member.person.skill}
          options={SKILL_OPTIONS}
          labels={t.member.options.skill}
          onChange={v =>
            update(m => ({
              ...m,
              person: {...m.person, skill: v},
            }))
          }
        />
      ),
    },
    {
      key: 'skillPoint',
      labelKey: t.member.fields.skillPos,
      width: '120px',
      input: 'text',
      get: m => m.skillPoint,
      set: (m, v) => ({...m, skillPoint: Number(v)}),
      maxValue: 100
    },
    /* ================= TALENT ================= */
    {
      key: 'talentType',
      labelKey: t.member.fields.talent,
      width: '80px',
      get: m => m.person.talentType,
      set: (m, v) => ({
        ...m,
        person: {...m.person, talentType: Number(v)},
      }),
      render: (member, update) => (
        <DropdownCell
          value={member.person.talentType}
          options={TALENT_OPTIONS}
          labels={t.member.options.talent}
          onChange={v =>
            update(m => ({
              ...m,
              person: {...m.person, talentType: v},
            }))
          }
        />
      ),
    },
    {
      key: 'talentValue',
      labelKey: t.member.fields.talentPos,
      input: 'text',
      width: '120px',
      get: m => m.person.talentValue,
      set: (m, v) => ({
        ...m,
        person: {...m.person, talentValue: Number(v)},
      }),
      maxValue: 100
    },
    {
      key: 'salary',
      labelKey: 'salary',
      width: '60px',
      input: 'text',
      get: m => m.salary,
      set: (m, v) => ({...m, salary: Number(v)}),
      maxValue: 0
    },
  ])
}
