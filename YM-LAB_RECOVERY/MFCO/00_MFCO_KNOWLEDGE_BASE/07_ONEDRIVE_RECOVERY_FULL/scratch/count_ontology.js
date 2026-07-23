const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, '../mfco-website/src/data/mfcoData.json');
const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let totalMappings = 0;
if (data.herbs) {
  data.herbs.forEach(h => {
    if (h.ontology_mappings) {
      totalMappings += h.ontology_mappings.length;
    }
  });
}

console.log('Total Herbs:', data.herbs ? data.herbs.length : 0);
console.log('Total Ontology Mappings:', totalMappings);
