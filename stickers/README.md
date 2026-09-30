# Shovita sticker wall

## WhatsApp se sticker nikaalne ka easiest tareeqa

1. Computer par WhatsApp Web/Desktop mein woh sticker kholo. Sticker par right-click karo aur **Copy sticker image** select karo—the option tumhare screenshot mein dikh raha hai.
2. Free [Photopea](https://www.photopea.com/) kholo. Blank screen par `Ctrl + V` karo. Agar browser clipboard permission pooche, Photopea ke liye allow karo.
3. `File → Export As → PNG` select karke PNG save karo. Checkerboard transparency dikh rahi ho toh transparent sticker sahi copy hua hai.
4. Us PNG ko is `stickers/` folder mein rakho. Short naam use karo, jaise `shovi-laugh.png` ya `shovi-side-eye.png`.

Photopea ke official guide mein clipboard se image paste karna aur `File → Export As → PNG` documented hai: [Open and Save](https://www.photopea.com/learn/opening-saving). Agar tumhare paas original `.webp` file already hai, usse seedha copy karo; conversion ki zaroorat nahi.

## Website mein dikhana

To show a sticker on the website, add one entry to the `STICKERS` list near the top of the sticker section in `../js/script.js`:

```js
const STICKERS = [
  { src: 'stickers/shovi-laugh.webp', caption: 'When the plan actually works' },
  { src: 'stickers/shovi-side-eye.png', caption: 'That look says everything' }
];
```

Caption sticker ke neeche aur tap-to-enlarge preview mein aayega. Har image ke liye ek entry add karo. Original sticker files yahin chat mein attach kar do toh unhe folder aur gallery mein add karna main kar dunga; pehle rename karna zaroori nahi.
