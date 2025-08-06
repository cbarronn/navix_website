// Image optimization script for banner
// This script will help create optimized versions of the images

const fs = require('fs');
const path = require('path');

// Configuration for image optimization
const config = {
    inputDir: './images',
    outputDir: './images/optimized',
    maxWidth: 1200,
    maxHeight: 600,
    quality: 80,
    formats: ['webp', 'jpg'] // Modern format with fallback
};

// Get all PNG files from images directory
function getImageFiles() {
    const imagesDir = path.join(__dirname, config.inputDir);
    const files = fs.readdirSync(imagesDir);
    return files.filter(file => file.toLowerCase().endsWith('.png'));
}

// Generate image list for the banner
function generateImageList() {
    const imageFiles = getImageFiles();
    const imageList = imageFiles.map((file, index) => ({
        original: `images/${file}`,
        optimized: `images/optimized/${file.replace('.png', '.webp')}`,
        fallback: `images/optimized/${file.replace('.png', '.jpg')}`,
        alt: `Banner Image ${index + 1}`,
        title: `Slide ${index + 1}`,
        description: `Descripción para slide ${index + 1}`
    }));
    
    // Write the image list to a JSON file for the banner to use
    fs.writeFileSync('./banner-images.json', JSON.stringify(imageList, null, 2));
    console.log(`Generated list of ${imageList.length} images`);
    return imageList;
}

// Create optimized directory if it doesn't exist
function createOptimizedDir() {
    const optimizedDir = path.join(__dirname, config.outputDir);
    if (!fs.existsSync(optimizedDir)) {
        fs.mkdirSync(optimizedDir, { recursive: true });
        console.log('Created optimized images directory');
    }
}

// Main function
function main() {
    createOptimizedDir();
    const imageList = generateImageList();
    
    console.log('Image optimization setup complete!');
    console.log('Next steps:');
    console.log('1. Use an image optimization tool like Sharp, ImageMagick, or online tools');
    console.log('2. Resize images to max 1200x600px');
    console.log('3. Convert to WebP format with 80% quality');
    console.log('4. Create JPG fallbacks');
    console.log(`5. Process ${imageList.length} images from the images folder`);
}

if (require.main === module) {
    main();
}

module.exports = { generateImageList, getImageFiles };
