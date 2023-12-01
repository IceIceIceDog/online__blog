

export const getAvatar = (username) => {
   
    const canvas = document.createElement('canvas');

    const ctx = canvas.getContext('2d');

    const avatarSize = 200;

    const fontSize = avatarSize / 2;

    canvas.width = avatarSize;

    canvas.height = avatarSize;

    const bgColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;

    const textColor = getLuminance(bgColor) > 0.5 ? 'black' : 'white';

    ctx.beginPath();

    ctx.arc(avatarSize / 2, avatarSize / 2, avatarSize / 2, 0, 2 * Math.PI);
    
    ctx.fillStyle = bgColor;

    ctx.fill();

    ctx.font = fontSize + 'px Arial';

    ctx.textAlign = 'center';

    ctx.textBaseline = 'middle';

    ctx.fillStyle = textColor;

    const charUsername = username.charAt(0);

    ctx.fillText(charUsername, avatarSize / 2, avatarSize / 2);



    
    function getLuminance(color){
        const colorArray = colorToRGBArray(color);

        return ((0.2126 * colorArray[0] + 0.7152 * colorArray[1] + 0.0722 * colorArray[2]) / 255);
    }

    function colorToRGBArray(color){
        const canvas = document.createElement('canvas');

        const ctx = canvas.getContext('2d');

        ctx.fillStyle = color;

        ctx.fillRect(0, 0, 1, 1);

        const data = ctx.getImageData(0, 0, 1, 1).data;

        return data.slice(0, 3);
    }



    return canvas.toDataURL('image/jpg'); 
    
}