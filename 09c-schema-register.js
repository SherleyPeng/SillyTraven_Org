// RealWorld Schema v1.5.0 (register for MVU pipeline)
// ═══ RealWorld 角色卡 Schema v1.5.0 ═══
// v1.0: 初版
// v1.4.0: Finance重构(cash+accounts/UID)+properties/vehicles/companies/company_holdings
// v1.5.0: entity_type字段(区分npc/real_person)

const clamp = (v, lo, hi) => Math.min(Math.max(v, lo), hi);

const num   = z.coerce.number().transform(v => Math.max(0, v)).default(0).catch(0);
const num1  = z.coerce.number().transform(v => Math.max(1, v)).default(1).catch(1);
const pct   = z.coerce.number().transform(v => clamp(v, 0, 100)).default(0).catch(0);
const str   = (d = '')    => z.string().default(d).catch(d);
const bool  = (d = false) => z.boolean().default(d).catch(d);

const TimeSchema = z.object({
  year:    num.default(2013), month: num.default(12), day: num.default(14),
  hour:    num.default(13), minute: num.default(0),
  weekday: str('星期六'), weather: str('晴'), season: str('冬')
}).default({}).catch({});

const InventoryItemSchema = z.object({ name: str(), desc: str() }).default({}).catch({});
const RelationshipSchema = z.object({ name: str(), relation: str(), status: str(), notes: str() }).default({}).catch({});

const ProfileSchema = z.object({
  name: str('彭少镭'), gender: str('男'), age: num.default(18),
  birth_year: num.default(1994), birth_month: num.default(12), birth_day: num.default(21),
  occupation: str('3D建模毕业生，求职中'), personality: str(),
  appearance: z.object({ build: str('清秀偏瘦'), full: str() }).default({}).catch({}),
  status: z.object({ physical: str('健康'), mental: str('正常') }).default({}).catch({}),
  stats: z.object({ physical: pct.default(80), mental: pct.default(75), fatigue: pct.default(45), hunger: pct.default(65), hygiene: pct.default(80) }).default({}).catch({}),
  wealth: str('普通'),
  inventory: z.array(InventoryItemSchema).default([]).catch([]),
  background: z.object({ hometown: str('吉林省某小镇'), education: str('高一休学 → 高三入北京火星时代学3D建模 → 2013.11毕业'), living: str('与同学合租火星时代校外宿舍楼，月租400元'), job_status: str('投递数十份简历，未获面试') }).default({}).catch({}),
  relationships: z.record(RelationshipSchema).default({}).catch({})
}).default({}).catch({});

// ── Finance v2: cash + accounts(UID) ──
const AccountSchema = z.object({
  bank: str(), type: z.enum(['储蓄卡','借记卡','信用卡','存折','支付宝余额']).default('储蓄卡').catch('储蓄卡'),
  balance: z.coerce.number().default(0).catch(0), note: str()
}).default({}).catch({});

const TransactionSchema = z.object({
  date: str(), amount: z.coerce.number().transform(v => Math.abs(v)).default(0).catch(0),
  direction: z.enum(['收入','支出']).default('支出').catch('支出'),
  account: str(), category: str(), note: str(), counterparty: str()
}).default({}).catch({});

const FinanceSchema = z.object({
  cash: num.default(200),
  accounts: z.record(AccountSchema).default({}).catch({}),
  transactions: z.array(TransactionSchema).default([]).catch([])
}).default({}).catch({});

// ── Properties ──
const PropertySchema = z.object({
  name: str(), property_type: z.enum(['住宅','商铺','写字楼','厂房','土地']).default('住宅').catch('住宅'),
  ownership: z.enum(['自有','租赁','按揭']).default('租赁').catch('租赁'),
  address: str(), area_sqm: num, purchase_price: num, current_value: num,
  monthly_payment: num, note: str()
}).default({}).catch({});

// ── Vehicles ──
const VehicleSchema = z.object({
  brand: str(), model: str(), year: num, plate: str(),
  vehicle_type: z.enum(['小汽车','摩托车','货车','自行车']).default('小汽车').catch('小汽车'),
  ownership: z.enum(['自有','租赁','按揭']).default('自有').catch('自有'),
  purchase_price: num, current_value: num, monthly_payment: num, note: str()
}).default({}).catch({});

// ── Companies ──
const CompanySchema = z.object({
  name: str(), company_type: z.enum(['个体工商户','有限责任公司','股份有限公司']).default('有限责任公司').catch('有限责任公司'),
  industry: str(), founded_date: str(),
  status: z.enum(['筹备中','正常经营','停业','已注销']).default('正常经营').catch('正常经营'),
  ownership_pct: pct, total_value: num, annual_revenue: num, annual_profit: num,
  employee_count: num, note: str()
}).default({}).catch({});

const CompanyHoldingSchema = z.object({
  from_comp: str(), to_comp: str(), shares_pct: pct
}).default({}).catch({});

// ── Sexual / NPC ──
const MenstrualSchema = z.object({ cycle_length: num1.default(28), period_duration: num1.default(5), last_period_date: str(), current_phase: z.enum(['月经中','安全期','受孕期']).default('安全期').catch('安全期') }).default({}).catch({});
const BreastsSchema = z.object({ size: str(), shape: str(), color: str(), sensitivity: str(), status: str() }).default({}).catch({});
const NipplesSchema = z.object({ shape: str(), color: str(), areola_color: str(), areola_size: str(), sensitivity: str(), status: str() }).default({}).catch({});
const VaginaSchema = z.object({ shape: str(), color: str(), inner_color: str(), tightness: str(), wetness: str(), sensitivity: str(), status: str() }).default({}).catch({});
const UterusSchema = z.object({ is_normal: bool(true), pregnancy: z.string().nullable().default(null).catch(null), sensitivity: str(), status: str() }).default({}).catch({});
const AnusSchema = z.object({ shape: str(), color: str(), tightness: str(), sensitivity: str(), is_developed: bool(false), status: str() }).default({}).catch({});
const BodyPartsSchema = z.object({ breasts: BreastsSchema, nipples: NipplesSchema, vagina: VaginaSchema, uterus: UterusSchema, anus: AnusSchema }).default({}).catch({});
const ExperienceSchema = z.object({ total: num, oral: num, vaginal: num, anal: num }).default({}).catch({});
const ExperienceWithUserSchema = z.object({ total: num, oral: num, vaginal: num, anal: num }).default({}).catch({});

const FemaleNPCSchema = z.object({
  name: str(), age: num, birth_year: num, birth_month: num, birth_day: num,
  entity_type: z.enum(['npc', 'real_person']).default('npc').catch('npc'),
  appearance: str(), outfit: str(), personality: str(),
  is_virgin: bool(true), first_partner: z.string().nullable().default(null).catch(null),
  menstrual: MenstrualSchema,
  friendship: pct, romance: pct, hatred: pct, obedience: pct,
  experience: ExperienceSchema, experience_with_user: ExperienceWithUserSchema,
  orgasm_count: num, body_parts: BodyPartsSchema,
  fetishes: z.array(z.string()).default([]).catch([])
}).default({}).catch({});

const MaleNPCSchema = z.object({ name: str(), age: num, entity_type: z.enum(['npc', 'real_person']).default('npc').catch('npc'), occupation: str(), social_status: str() }).default({}).catch({});

// ── Misc ──
const KotodamaRecordSchema = z.object({ id: num, time: str(), command: str(), result: str(), active: bool(true) }).default({}).catch({});
const WeChatMessageSchema = z.object({ from: str(), text: str(), time: str() }).default({}).catch({});
const WeChatContactSchema = z.object({ name: str(), messages: z.array(WeChatMessageSchema).default([]).catch([]) }).default({}).catch({});
const WeiboPostSchema = z.object({ title: str(), summary: str(), category: str(), time: str(), source: str() }).default({}).catch({});
const ConnectionSchema = z.object({ id: str(), from: str(), to: str(), relation: str() }).default({}).catch({});
const CalendarEventSchema = z.object({ date: str(), title: str(), type: str() }).default({}).catch({});

const Schema = z.object({
  location: str('北京火星时代校外宿舍'),
  time:    TimeSchema,
  profile: ProfileSchema,
  finance: FinanceSchema,
  properties:       z.record(PropertySchema).default({}).catch({}),
  vehicles:         z.record(VehicleSchema).default({}).catch({}),
  companies:        z.record(CompanySchema).default({}).catch({}),
  company_holdings: z.array(CompanyHoldingSchema).default([]).catch([]),
  sexual:   z.record(FemaleNPCSchema).default({}).catch({}),
  npc_male: z.record(MaleNPCSchema).default({}).catch({}),
  connections:      z.array(ConnectionSchema).default([]).catch([]),
  calendar_events:  z.array(CalendarEventSchema).default([]).catch([]),
  wechat:   z.record(WeChatContactSchema).default({}).catch({}),
  weibo:    z.object({ posts: z.array(WeiboPostSchema).default([]).catch([]) }).default({}).catch({}),
  kotodama: z.object({ records: z.array(KotodamaRecordSchema).default([]).catch([]) }).default({}).catch({}),
  _uid_counters: z.object({
    relationship: num, sexual_char: num, npc_male: num,
    account: num, property: num, vehicle: num, company: num
  }).default({}).catch({})
});

$(() => { registerMvuSchema(Schema); });
