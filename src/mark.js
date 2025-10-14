const fs = require("fs");
const sharp = require("sharp");
const f5stego = require("f5stegojs");

const stegKey = [1, 2, 3, 4, 5, 6, 7, 8, 9];
// const stegger = new f5stego(stegKey);
// const input = fs.readFileSync("src/img/collections/car.JPG");



// consolef5.prototype.getAPPn(0xFE);




// stegger.parse(input);

// console.log("INIT", stegger.getAPPn(0xEF));


// stegger.setAPPn(0x01, 0);
//
// fs.writeFileSync("test.jpg", stegger.pack());

const pictures = fs.readdirSync("src/img/collections", { "withFileTypes": true });

var picturesUnmarked = [];


var maxAPPn = 0;

for (var i = 0; i < pictures.length; i++) {
  path = pictures[i].parentPath + "/" + pictures[i].name
  console.log(path)
  const stegger = new f5stego(stegKey);
  const input = fs.readFileSync(path);
  stegger.parse(input);
  const APPn = stegger.getAPPn(0xEF);
  console.log(APPn || "nah");
  if (APPn == null) {
    picturesUnmarked.push(path);
  } else {
  }
  if (maxAPPn < Number(String.fromCharCode(APPn))) {
    maxAPPn = String.fromCharCode(APPn);
  }


}

console.log(picturesUnmarked);


const picturesSorted = picturesUnmarked.map(function(file) {
  return {
    file: file,
    time: fs.statSync(file).mtime.getTime(),
  };
})
  .sort(function(a, b) {
    return b.time - a.time;
  })
  .map((file) => {
    const stegger = new f5stego(stegKey);
    const input = fs.readFileSync(file.file);
    sharp(input).resize({ height: 1000 }).toBuffer((err, buf) => {
      stegger.parse(buf);
      console.log(maxAPPn);
      stegger.setAPPn(0x01, 0);
      console.log(stegger.setAPPn(0xEF, Buffer.from((++maxAPPn).toString(), "utf8")));
      fs.writeFileSync(file.file, stegger.pack());

    })


  })
