import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

def create_composite_image(image_paths, captions, output_path):
    """
    Create a composite image from 4 images with captions.
    
    Args:
        image_paths (list): List of 4 input image paths
        captions (list): List of 4 captions for each image
        output_path (str): Path to save the composite image
    """
    # Define dimensions
    single_width = 200
    single_height = 100
    padding = 10
    caption_height = 30
    
    # Calculate total dimensions
    total_width = (single_width + padding) * 2 - padding
    total_height = (single_height + padding + caption_height) * 2 - padding
    
    # Create blank composite image (white background)
    composite = np.ones((total_height, total_width, 3), dtype=np.uint8) * 255
    
    # Process each image
    for idx, (img_path, caption) in enumerate(zip(image_paths, captions)):
        # Calculate position
        row = idx // 2
        col = idx % 2
        
        x = col * (single_width + padding)
        y = row * (single_height + padding + caption_height)
        
        # Read and resize image
        img = cv2.imread(img_path)
        if img is None:
            raise ValueError(f"Could not load image: {img_path}")
        img = cv2.resize(img, (single_width, single_height))
        
        # Place image in composite
        composite[y:y+single_height, x:x+single_width] = img
        
        # Convert to PIL for text
        pil_img = Image.fromarray(composite)
        draw = ImageDraw.Draw(pil_img)
        
        # Try to load a font, fall back to default if not available
        try:
            font = ImageFont.truetype("arial.ttf", 16)
        except:
            font = ImageFont.load_default()
        
        # Add caption
        draw.text((x+5, y+single_height+5), caption, 
                 fill=(0, 0, 0), font=font)
        
        # Convert back to numpy array
        composite = np.array(pil_img)
    
    # Save the composite image
    cv2.imwrite(output_path, composite)
    return output_path

if __name__ == "__main__":
    # Example usage
    image_paths = [
        "r1_input_cropped.png",
        "r1_MIMO-UNetplus_cropped.png",
        "r1_restormer_cropped.png",
        "r1_ours_cropped.png"
    ]
    
    captions = [
        "Original Image",
        "MIMO UNet+",
        "Restormer",
        "Ours"
    ]
    
    try:
        output = create_composite_image(image_paths, captions, "composite.jpg")
        print(f"Composite image saved as: {output}")
    except Exception as e:
        print(f"Error: {e}")