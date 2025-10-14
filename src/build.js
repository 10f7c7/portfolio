const fs = require('fs');
const f5stego = require("f5stegojs");

// app.use('/', express.static(path.join(__dirname, 'public')));

//TODO: make program run and auto compile on save using `npm-watch`

const stegKey = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const templateDir = "./src/templates/"


function addNav(data, path) {
  // data: raw file
  // path: path to file in accordance to the webserver "/collections/metal_earth/image.JPG"

  if (path[0] == "/") {
    path = path.slice(1, path.length);
  }

  var nav = fs.readFileSync(templateDir + "nav.html").toString();
  var navPath = fs.readFileSync(templateDir + "navPath.html").toString();

  if (path == "") {
    return data.replace("%nav%", nav.replace("%path%", ""));
  }

  var pathLvl = "";

  let levels = path.split("/").map(level => {
    pathLvl += "/" + level;
    return navPath.replaceAll("%location%", level).replace("%path%", pathLvl);
  });

  // console.log(levels);

  return data.replace("%nav%", nav.replace("%path%", levels.join('')));

}




fs.rmSync("./build", { recursive: true, force: true });
fs.mkdirSync("./build");
// fs.copyFileSync("./src/public/output.css", "./build/output.css");
fs.cpSync("./src/img", "./build/img", { recursive: true, preserveTimestamps: true });
fs.mkdirSync("./build/collections");


var footerHTML = fs.readFileSync(templateDir + "footer.html").toString();

footerHTML = footerHTML.replace("%year%", new Date().getFullYear());


var homeindexHTML = fs.readFileSync(templateDir + "index.html").toString();


homeindexHTML = homeindexHTML.replace("%head%", fs.readFileSync(templateDir + "head.html").toString());
homeindexHTML = addNav(homeindexHTML, "");//homeindexHTML.replace("%nav%", fs.readFileSync(templateDir + "nav.html").toString());
homeindexHTML = homeindexHTML.replace("%main%", fs.readFileSync("./src/page/index.html").toString());
homeindexHTML = homeindexHTML.replace("%footer%", footerHTML);

fs.writeFileSync("./build/index.html", homeindexHTML);

var collectionsindexHTML = fs.readFileSync(templateDir + "index.html").toString();

var collectionsHTML = fs.readFileSync("./src/page/collections/index.html").toString();


var picturesHTML = "";

const pictures = fs.readdirSync("src/img/collections", { "withFileTypes": true });


const picturesSorted = pictures.map(function(file) {
  const stegger = new f5stego(stegKey);
  const path = "src/img/collections" + '/' + file.name;
  const input = fs.readFileSync(path);
  stegger.parse(input);
  const APPn = String.fromCharCode(stegger.getAPPn(0xEF));


  return {
    name: file.name,
    appn: APPn,
    // time: fs.statSync("src/img/collections" + '/' + file.name).mtime.getTime(),
    parentPath: file.parentPath,
    isDir: file.isDirectory()
  };
})
  .sort(function(a, b) {
    return b.appn - a.appn;
  })

// console.log(pictures);
// console.log(picturesSorted);


picturesSorted.forEach(item => {
  var itemHTML = fs.readFileSync("./src/page/collections/(item).html").toString();
  var path = item.parentPath.replace("src/img", "") + "/" + item.name;

  itemHTML = itemHTML.replace("%path%", item.parentPath.replace("src", "") + "/" + item.name);
  itemHTML = itemHTML.replace("%name%", item.name);
  // itemHTML = itemHTML
  picturesHTML += itemHTML.replace("%hover%", "hover:translate-2 transition mb-9").replace("%itempath%", `href="${path}"`).replace("%height%", "");



  var itemindexHTML = fs.readFileSync(templateDir + "index.html").toString();

  var itemitemHTML = fs.readFileSync("./src/page/collections/(item)/index.html").toString();

  itemitemHTML = itemitemHTML.replace("%item%", itemHTML.replace("%hover%", "").replace("%itempath%", "").replace("%height%", "h-[77vh]"));

  itemindexHTML = addNav(itemindexHTML, path);

  itemindexHTML = itemindexHTML.replace("%head%", fs.readFileSync(templateDir + "head.html").toString());
  itemindexHTML = itemindexHTML.replace("%main%", itemitemHTML);
  itemindexHTML = itemindexHTML.replace("%footer%", footerHTML);


  fs.mkdirSync("./build" + path);
  fs.writeFileSync("./build" + path + "/index.html", itemindexHTML);


});


collectionsHTML = collectionsHTML.replace("%items%", picturesHTML);




collectionsindexHTML = collectionsindexHTML.replace("%head%", fs.readFileSync(templateDir + "head.html").toString());
collectionsindexHTML = addNav(collectionsindexHTML, "collections");//collectionsindexHTML.replace("%nav%", fs.readFileSync(templateDir + "nav.html").toString());
collectionsindexHTML = collectionsindexHTML.replace("%main%", collectionsHTML);
collectionsindexHTML = collectionsindexHTML.replace("%footer%", footerHTML);

fs.writeFileSync("./build/collections/index.html", collectionsindexHTML);

