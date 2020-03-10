// write your code here
function check(x,y,n,m) {
    if(x <= n && y <= m) return true;
    return false;
}

function crop(image,width,height) {
    const w = Math.min(image.getWidth(),width),h = Math.min(image.getHeight(),height);
    let output = new SimpleImage(w,h);
    for(let pixel of image.values()) {
        let x = pixel.getX(),y = pixel.getY();
        if(check(x,y,w - 1,h - 1)) {
            output.setPixel(x,y,pixel);
        }        
    }
    
    return output;
}

function choppedValue(x) {
    return Math.floor(x / 16) * 16;
}

function chop2hide(image) {
    for(let pixel of image.values()) {
        pixel.setRed(choppedValue(pixel.getRed()));
        pixel.setGreen(choppedValue(pixel.getGreen()));
        pixel.setBlue(choppedValue(pixel.getBlue()));
    }    
    return image;
}

function shift(image) {
    for(let pixel of image.values()) {
        pixel.setRed(pixel.getRed() / 16);
        pixel.setGreen(pixel.getGreen() / 16);
        pixel.setBlue(pixel.getBlue() / 16);
    }
    return image;
}

function add(pixel,first,second) {
    pixel.setRed(first.getRed() + second.getRed());
    pixel.setGreen(first.getGreen() + second.getGreen());
    pixel.setBlue(first.getBlue() + second.getBlue());
    return pixel;
}

function combine(start,hide) {
    let w = start.getWidth(),h = start.getHeight();
    let output = new SimpleImage(w,h);
    for(let pixel of output.values()) {
        let x = pixel.getX(),y = pixel.getY();
        let first = start.getPixel(x,y);
        let second;
        let flag = false;
        if(x < hide.getWidth() && y < hide.getHeight()) second = hide.getPixel(x,y);
        else flag = true;
        if(flag) {
            pixel.setRed(first.getRed());
            pixel.setGreen(first.getGreen());
            pixel.setBlue(first.getBlue());
        }
        else{
            pixel = add(pixel,first,second);
        }
    }
    return output;
}

function individualComponent(value) {
    return (value % 16) * 16;
}

function findComponent(newpixel,pixel) {
    newpixel.setRed(individualComponent(pixel.getRed()));
    newpixel.setGreen(individualComponent(pixel.getGreen()));
    newpixel.setBlue(individualComponent(pixel.getBlue()));
    return newpixel;
}

function extract(image) {
    
    let output = new SimpleImage(image.getWidth(),image.getHeight());
    for(let pixel of image.values()) {
        let x = pixel.getX(),y = pixel.getY();
        let newpixel = output.getPixel(x,y);
        output.setPixel(x,y,findComponent(newpixel,pixel));
    }
    return output;
} 

let start = new SimpleImage("smalluniverse.jpg");
start = chop2hide(start);
let hide = new SimpleImage("astrachan.jpg");
let width = start.getWidth(),height = start.getHeight();
if(width > hide.getWidth()) {
    width = hide.getWidth();
}
if(height > hide.getHeight()) {
    height = hide.getHeight();
}

start = crop(start,width,height);
hide = crop(hide,width,height);
hide = shift(hide);
let finish = combine(start,hide);
print(finish);

// Extracting the secret image;
let secret = extract(finish);
print(secret);