from PIL import Image

def add_black_background(input_path, output_path):
    """
    Add a black background to a PNG image while preserving transparency.
    
    Args:
        input_path (str): Path to input PNG image
        output_path (str): Path to save the output image
    """
    # Open the image
    img = Image.open(input_path)
    
    # Convert the image to RGBA if it isn't already
    if img.mode != 'RGBA':
        img = img.convert('RGBA')
    
    # Create a new image with black background
    background = Image.new('RGBA', img.size, (0, 0, 0, 255))
    
    # Paste the original image onto the background using alpha compositing
    background.paste(img, (0, 0), img)
    
    # Save the result
    background.save(output_path, 'PNG')

# Example usage
add_black_background('cail.png', 'output.png')