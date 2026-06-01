const fs = require('fs');
const files = [
  'src/Pages/Dashboard/AdminDashboard/Components/AddBook.js',
  'src/Pages/Dashboard/AdminDashboard/Components/AddTransaction.js',
  'src/Pages/Dashboard/AdminDashboard/Components/Return.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // Handle case where it's at the end of the object (with a preceding comma)
  content = content.replace(/,\s*isAdmin:\s*user\.isAdmin/g, '');
  // Handle case where it's at the beginning or middle (with a trailing comma)
  content = content.replace(/isAdmin:\s*user\.isAdmin\s*,?/g, '');
  fs.writeFileSync(file, content);
});
console.log('Done removing isAdmin payloads');
