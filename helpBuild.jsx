const { appendFile, access, constants } = require('fs');
require('@babel/register');
const locales = ['en', 'es', 'fr', 'it', 'pt'];

const buildHelp = () => {
  console.log('build help pages');
  let i18n = [];
  locales.map((l,i) => {
    const trad = require('./src/i18n/locales/'+l+'.json');
    i18n[l]=trad.menu;
    return l;
  });
  Object.entries(i18n).forEach(([key, value]) => {
    // get every item from menu and check if for each entry we have an help marldown file that exist if not then create it
    Object.entries(i18n[key]).forEach(([mkey, mvalue]) => {
      const path = './src/components/help/'+key+'/'+mvalue+'.md';
      // Check if the file exists in the current directory.
      access(path, constants.F_OK, (err) => {
        if (err) {
          const data = "##"+mvalue;
          appendFile(path, data, (err) => {
            if (err) throw err;
          });
        }
      });
   });

 });
};
buildHelp();
console.log('end');
