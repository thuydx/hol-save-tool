import {MemberQuParsed} from "@/models/memberQu";
import {buildBaseColumns, ColumnSchema} from "@/columns/buildBaseColumns";
import {DropdownCell} from "@/components/table/DropdownCell";
import {HOBBY_OPTIONS, SKILL_OPTIONS, TALENT_OPTIONS} from "@/constants/options";
import {InputCell} from "@/components/table/InputCell";

export function buildMemberQuColumns(t: any): ColumnSchema<MemberQuParsed> {
  const isMale = (m: MemberQuParsed) => m.personData.gender === 1
  return buildBaseColumns<MemberQuParsed>([
    {
      key: 'name',
      labelKey: t.member.fields.name,
      input: 'text',
      get: m => m.personData.name,
      set: (m, v) => ({
        ...m,
        personData: {...m.personData, name: v},
      }),
    },
    {
      key: 'age',
      labelKey: t.member.fields.age,
      width: '40px',
      input: 'text',
      get: m => m.age,
      set: (m, v) => ({...m, age: Number(v)})
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
      get: m => m.personData.luck,
      set: (m, v) => ({
        ...m,
        personData: {...m.personData, luck: Number(v)},
      }),
      maxValue: 100
    },
    /* ================= HOBBY ================= */
    {
      key: 'hobby',
      labelKey: t.member.fields.hobby,
      width: '50px',
      get: m => m.personData.hobby,
      set: (m, v) => ({
        ...m,
        personData: {...m.personData, hobby: Number(v)},
      }),
      render: (member, update) => (
        <DropdownCell
          value={member.personData.hobby}
          options={HOBBY_OPTIONS}
          labels={t.member.options.hobby}
          onChange={v =>
            update(m => ({
              ...m,
              personData: {...m.personData, hobby: v},
            }))
          }
        />
      ),
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
    {
      key: 'strategy',
      labelKey: t.member.fields.strategy,
      width: '80px',
      input: 'text',
      get: m => m.strategy,
      set: (m, v) => ({...m, strategy: Number(v)}),
      maxValue: 100
    },
    {
      key: 'stamina',
      labelKey: t.member.fields.stamina,
      width: '80px',
      input: 'text',
      get: m => m.stamina,
      set: (m, v) => ({...m, stamina: Number(v)}),
      maxValue: 50
    },
    /* ================= SKILLS ================= */
    {
      key: 'skills',
      labelKey: t.member.fields.skills,
      width: '50px',
      get: m => m.personData.skills,
      set: (m, v) => ({
        ...m,
        personData: {...m.personData, skills: Number(v)},
      }),
      render: (member, update, t) => (
        <DropdownCell
          value={member.personData.skills}
          options={SKILL_OPTIONS}
          labels={t.member.options.skill}
          onChange={v =>
            update(m => ({
              ...m,
              personData: {...m.personData, skills: v},
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
      key: 'talent',
      labelKey: t.member.fields.talent,
      width: '50px',
      get: m => m.personData.talent,
      set: (m, v) => ({
        ...m,
        personData: {...m.personData, talent: Number(v)},
      }),
      render: (member, update) => (
        <DropdownCell
          value={member.personData.talent}
          options={TALENT_OPTIONS}
          labels={t.member.options.talent}
          onChange={v =>
            update(m => ({
              ...m,
              personData: {...m.personData, talent: v},
            }))
          }
        />
      ),
    },
    {
      key: 'talentPoint',
      labelKey: t.member.fields.talentPos,
      input: 'text',
      width: '120px',
      get: m => m.personData.talentPoint,
      set: (m, v) => ({
        ...m,
        personData: {...m.personData, talentPoint: Number(v)},
      }),
      maxValue: 100
    },
    {
      key: 'gender',
      labelKey: t.member.fields.gender,
      width: '80px',
      input: 'text',
      get: m => m.personData.gender,
      set: m => m,
      render: (member, update) => (
        <span>
          {t.member.options.gender[member.personData.gender]}
        </span>
      ),
    },
    {
      key: 'pregnancyStatus',
      labelKey: t.member.fields.pregnancy,
      width: '40px',
      input: 'number',
      get: m => m.pregnancyStatus,
      set: (m, v) => ({...m, pregnancyStatus: Number(v)}),
      render: (member, update) => {
        const disabled = isMale(member)

        return (
          <InputCell
            value={member.pregnancyStatus}
            type="number"
            disabled={disabled}
            onChange={v => {
              if (disabled) return
              update(m => ({...m, pregnancyStatus: Number(v)}))
            }}
          />
        )
      }
    },
    {
      key: 'pregnancyMonth',
      labelKey: t.member.fields.pregMonth,
      width: '90px',
      input: 'number',
      get: m => m.pregnancyMonth,
      set: (m, v) => ({...m, pregnancyMonth: Number(v)}),
      render: (member, update) => {
        const disabled = isMale(member)

        return (
          <InputCell
            value={member.pregnancyMonth}
            type="number"
            disabled={disabled}
            onChange={v => {
              if (disabled) return
              update(m => ({...m, pregnancyMonth: Number(v)}))
            }}
          />
        )
      },
    },
  ])
}
