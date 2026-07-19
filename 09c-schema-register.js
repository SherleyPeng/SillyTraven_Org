import { registerMvuSchema } from 'https://testingcf.jsdelivr.net/gh/StageDog/tavern_resource/dist/util/mvu_zod.js';

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const num   = z.coerce.number().transform(v => Math.max(0, v)).default(0).catch(0);
const num1  = z.coerce.number().transform(v => Math.max(1, v)).default(1).catch(1);
const pct   = z.coerce.number().transform(v => clamp(v, 0, 100)).default(0).catch(0);
const str   = (d = '')    => z.string().default(d).catch(d);
const bool  = (d = false) => z.boolean().default(d).catch(d);

const TimeSchema = z.object({
  year:    num.default(2013),
  month:   num.default(12),
  day:     num.default(14),
  hour:    num.default(13),
  minute:  num.default(0),
  weekday: str('星期六'),
  weather: str('晴'),
  season:  str('冬')
}).default({}).catch({});

const InventoryItemSchema = z.object({
  name: str(),
  desc: str()
}).default({}).catch({});

const RelationshipSchema = z.object({
  name:     str(),
  relation: str(),
  status:   str(),
  notes:    str()
}).default({}).catch({});

const ProfileSchema = z.object({
  name:         str('彭少镭'),
  gender:       str('男'),
  age:          num.default(18),
  birth_year:   num.default(1994),
  birth_month:  num.default(12),
  birth_day:    num.default(21),
  occupation:   str('3D建模毕业生，求职中'),
  personality:  str(),
  appearance: z.object({
    build: str('清秀偏瘦'),
    full:  str()
  }).default({}).catch({}),
  status: z.object({
    physical: str('健康'),
    mental:   str('正常')
  }).default({}).catch({}),
  inventory: z.array(InventoryItemSchema).default([]).catch([]),
  background: z.object({
    hometown:   str('吉林省某小镇'),
    education:  str('高一休学 → 高三入北京火星时代学3D建模 → 2013.11毕业'),
    living:     str('与同学合租火星时代校外宿舍楼，月租400元'),
    job_status: str('投递数十份简历，未获面试')
  }).default({}).catch({}),
  relationships: z.object({}).catchall(RelationshipSchema).default({}).catch({})
}).default({}).catch({});

const TransactionSchema = z.object({
  date:     str(),
  amount:   z.coerce.number().default(0).catch(0),
  type:     str(),
  account:  str(),
  category: str(),
  note:     str()
}).default({}).catch({});

const FinanceSchema = z.object({
  assets: z.object({})
    .catchall(z.coerce.number().default(0).catch(0))
    .default({ 现金: 200, 建设银行存款: 800 })
    .catch({ 现金: 200, 建设银行存款: 800 }),
  transactions: z.array(TransactionSchema).default([]).catch([])
}).default({}).catch({});

const MenstrualSchema = z.object({
  cycle_length:    num1.default(28),
  period_duration: num1.default(5),
  last_period_date: str(),
  current_phase:   z.enum(['月经中', '安全期', '受孕期']).default('安全期').catch('安全期')
}).default({}).catch({});

const BreastsSchema = z.object({
  size:        str(),
  shape:       str(),
  color:       str(),
  sensitivity: str(),
  status:      str()
}).default({}).catch({});

const NipplesSchema = z.object({
  shape:        str(),
  color:        str(),
  areola_color: str(),
  areola_size:  str(),
  sensitivity:  str(),
  status:       str()
}).default({}).catch({});

const VaginaSchema = z.object({
  shape:       str(),
  color:       str(),
  inner_color: str(),
  tightness:   str(),
  wetness:     str(),
  sensitivity: str(),
  status:      str()
}).default({}).catch({});

const UterusSchema = z.object({
  is_normal:   bool(true),
  pregnancy:   z.string().nullable().default(null).catch(null),
  sensitivity: str(),
  status:      str()
}).default({}).catch({});

const AnusSchema = z.object({
  shape:        str(),
  color:        str(),
  tightness:    str(),
  sensitivity:  str(),
  is_developed: bool(false),
  status:       str()
}).default({}).catch({});

const BodyPartsSchema = z.object({
  breasts: BreastsSchema,
  nipples: NipplesSchema,
  vagina:  VaginaSchema,
  uterus:  UterusSchema,
  anus:    AnusSchema
}).default({}).catch({});

const ExperienceSchema = z.object({
  total:   num,
  oral:    num,
  vaginal: num,
  anal:    num
}).default({}).catch({});

const FemaleNPCSchema = z.object({
  name:          str(),
  age:           num,
  birth_year:    num,
  birth_month:   num,
  birth_day:     num,
  appearance:    str(),
  outfit:        str(),
  personality:   str(),
  is_virgin:     bool(true),
  first_partner: z.string().nullable().default(null).catch(null),
  menstrual:     MenstrualSchema,
  affection:     pct,
  obedience:     pct,
  experience:    ExperienceSchema,
  orgasm_count:  num,
  body_parts:    BodyPartsSchema,
  fetishes:      z.array(z.string()).default([]).catch([])
}).default({}).catch({});

const MaleNPCSchema = z.object({
  name:          str(),
  age:           num,
  occupation:    str(),
  social_status: str()
}).default({}).catch({});

const WeChatMessageSchema = z.object({
  from: str(),
  text: str(),
  time: str()
}).default({}).catch({});

const WeChatContactSchema = z.object({
  name: str(),
  messages: z.array(WeChatMessageSchema).default([]).catch([])
}).default({}).catch({});

const WeiboPostSchema = z.object({
  title:    str(),
  summary:  str(),
  category: str(),
  time:     str(),
  source:   str()
}).default({}).catch({});

const Schema = z.object({
  time:    TimeSchema,
  profile: ProfileSchema,
  finance: FinanceSchema,
  sexual:   z.object({}).catchall(FemaleNPCSchema).default({}).catch({}),
  npc_male: z.object({}).catchall(MaleNPCSchema).default({}).catch({}),
  wechat:   z.object({}).catchall(WeChatContactSchema).default({}).catch({}),
  weibo:    z.object({
    posts: z.array(WeiboPostSchema).default([]).catch([])
  }).default({}).catch({}),
  _uid_counters: z.object({
    relationship: num,
    sexual_char:  num,
    npc_male:     num
  }).default({}).catch({})
});

$(() => { registerMvuSchema(Schema); });
