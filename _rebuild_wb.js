const fs = require('fs');

// Read new entries from our working file
const nw = JSON.parse(fs.readFileSync(__dirname + '/08-worldbook-new.json', 'utf8'));
const oldEntries = nw.entries;

// Convert each entry to the correct ST character_book format
const entries = [];
for (const [uid, e] of Object.entries(oldEntries)) {
  const id = e.uid || parseInt(uid);
  const posNum = e.position || 1;
  const posStr = posNum === 0 ? 'before_char' : 'after_char';
  
  entries.push({
    id: id,
    keys: e.keys || [],
    secondary_keys: e.keysecondary || [],
    comment: e.comment || '',
    content: e.content || '',
    constant: !!e.constant,
    selective: e.selectiveLogic > 0 ? true : false,
    insertion_order: e.order || 0,
    enabled: e.enabled !== false,
    position: posStr,
    use_regex: e.use_regex || false,
    extensions: {
      position: posNum,
      exclude_recursion: e.recursion ? e.recursion.prevent_incoming : true,
      display_index: e.display_index || id,
      probability: 100,
      useProbability: true,
      depth: e.depth || 4,
      selectiveLogic: e.selectiveLogic || 0,
      outlet_name: '',
      group: '',
      group_override: false,
      group_weight: 100,
      prevent_recursion: e.recursion ? e.recursion.prevent_outgoing : true,
      delay_until_recursion: false,
      scan_depth: null,
      match_whole_words: null,
      use_group_scoring: false,
      case_sensitive: null,
      automation_id: '',
      role: 0,
      vectorized: false,
      sticky: 0,
      cooldown: 0,
      delay: 0,
      match_persona_description: false,
      match_character_description: false,
      match_character_personality: false,
      match_character_depth_prompt: false,
      match_scenario: false,
      match_creator_notes: false,
      triggers: [],
      ignore_budget: false
    }
  });
}

// Sort by insertion_order
entries.sort((a, b) => a.insertion_order - b.insertion_order);

// Build standalone worldbook (for import)
const worldbook = {
  entries: entries,
  originalData: {
    entries: entries,
    extensions: {},
    name: 'RealWorld'
  }
};

fs.writeFileSync(__dirname + '/08-worldbook-v2.json', JSON.stringify(worldbook, null, 2), 'utf8');
console.log('Created 08-worldbook-v2.json with ' + entries.length + ' entries');
console.log('Entry[0] id=' + entries[0].id + ' comment=' + entries[0].comment);
console.log('Entry[last] id=' + entries[entries.length-1].id + ' comment=' + entries[entries.length-1].comment);

// Also build character_book for card embedding
const characterBook = {
  name: 'RealWorld',
  description: '',
  extensions: {},
  entries: entries
};

// Update card JSON
const card = JSON.parse(fs.readFileSync(__dirname + '/RealWorld.card.json', 'utf8'));
card.data.character_book = characterBook;
card.data.character_version = '1.7.3';

// Write new card JSON
fs.writeFileSync(__dirname + '/RealWorld_v1.7.3.card.json', JSON.stringify(card, null, 2), 'utf8');
console.log('Updated card JSON: RealWorld_v1.7.3.card.json');

// Pack PNG
const zlib = require('zlib');
function crc32(buf) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let j = 0; j < 8; j++) c = (c >>> 1) ^ (c & 1 ? 0xEDB88320 : 0);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}
function pngChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const tb = Buffer.from(type, 'ascii');
  const cd = Buffer.concat([tb, data]);
  const cr = Buffer.alloc(4);
  cr.writeUInt32BE(crc32(cd), 0);
  return Buffer.concat([len, tb, data, cr]);
}
const raw = Buffer.alloc(39);
for (let y = 0; y < 3; y++) raw[1 + y * 13] = 0;
for (let i = 1; i < 39; i++) raw[i] = i < 14 ? 40 : (i < 27 ? 80 : 160);
const b64 = Buffer.from(JSON.stringify(card), 'utf8').toString('base64');
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  pngChunk('IHDR', Buffer.from([0, 0, 0, 3, 0, 0, 0, 3, 8, 2, 0, 0, 0])),
  pngChunk('tEXt', Buffer.from('chara\0' + b64, 'utf8')),
  pngChunk('IDAT', zlib.deflateSync(raw)),
  pngChunk('IEND', Buffer.alloc(0)),
]);
fs.writeFileSync(__dirname + '/../RealWorld_v1.7.3.png', png);
console.log('PNG packed: RealWorld_v1.7.3.png (' + png.length + ' bytes)');
console.log('Done!');
