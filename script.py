import cv2
import os

def crop_bounding_box(image_path, x, y, width, height):
    """
    Crop a bounding box from an image and save with '_cropped' suffix.
    
    Args:
        image_path (str): Path to the input image
        x (int): X coordinate of top-left corner
        y (int): Y coordinate of top-left corner
        width (int): Width of bounding box
        height (int): Height of bounding box
    """
    # Read the image
    image = cv2.imread(image_path)
    
    if image is None:
        raise ValueError("Could not load image")
    
    # Get image dimensions
    img_height, img_width = image.shape[:2]
    
    # Ensure coordinates are within image bounds
    x = max(0, min(x, img_width))
    y = max(0, min(y, img_height))
    
    # Ensure width and height don't exceed image boundaries
    width = min(width, img_width - x)
    height = min(height, img_height - y)
    
    # Crop the image
    cropped_image = image[y:y+height, x:x+width]
    
    # Generate output filename
    filename, ext = os.path.splitext(image_path)
    output_path = f"{filename}_cropped{ext}"
    
    # Save the cropped image
    cv2.imwrite(output_path, cropped_image)
    return output_path

if __name__ == "__main__":
    try:
        # Example usage
        image_path = "r1_restormer.png"
        x, y = 120, 370
        width, height = 200, 100
        
        output_path = crop_bounding_box(image_path, x, y, width, height)
        print(f"Cropped image saved as: {output_path}")
        
    except Exception as e:
        print(f"Error: {e}")