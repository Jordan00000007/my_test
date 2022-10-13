
export const getSvg = (name) => {

    
    switch (name) {

        case 'icon_edit':
            return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 44 44">
            <defs>
                <clipPath id="clip-icon_edit">
                <rect width="44" height="44"/>
                </clipPath>
            </defs>
            <g id="icon_edit" clip-path="url(#clip-icon_edit)">
                <g id="icon_edit-2" data-name="icon_edit">
                <rect id="bk" width="44" height="44" fill="#828282" opacity="0"/>
                <path id="edit-solid" d="M168.139,2.9l3.035,3.035a.329.329,0,0,1,0,.464l-7.35,7.35-3.123.347a.655.655,0,0,1-.724-.724l.347-3.123,7.35-7.35A.329.329,0,0,1,168.139,2.9Zm5.452-.771L171.949.484a1.316,1.316,0,0,0-1.858,0L168.9,1.675a.329.329,0,0,0,0,.464l3.035,3.035a.329.329,0,0,0,.464,0l1.191-1.191A1.316,1.316,0,0,0,173.591,2.126Z" transform="translate(-144.975 15.9)" fill="#112b4e"/>
                </g>
            </g>
            </svg> 
            `;
            break;

        case 'icon_next':
            return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 44 44">
            <defs>
                <clipPath id="clip-icon_next">
                <rect width="44" height="44"/>
                </clipPath>
            </defs>
            <g id="icon_next" clip-path="url(#clip-icon_next)">
                <g id="icon_next-2" data-name="icon_next">
                <g id="next">
                    <path id="bk" d="M44,0H0V44H44Z" fill="none"/>
                    <path id="icon" d="M0,1.9,1.9,0,10,8.1l-8.1,8.1L0,14.291,6.181,8.1Z" transform="translate(17 14)" fill="#112b4e"/>
                </g>
                </g>
            </g>
            </svg> 
            `;
            break;

        case 'icon_menu':
            return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 44 44">
            <defs>
                <clipPath id="clip-icon_menu">
                <rect width="44" height="44"/>
                </clipPath>
            </defs>
            <g id="icon_menu" clip-path="url(#clip-icon_menu)">
                <g id="icon_menu-2" data-name="icon_menu">
                <g id="bk" fill="#112b4e" stroke="#1871e6" stroke-width="1" opacity="0">
                    <rect width="44" height="44" rx="4" stroke="none"/>
                    <rect x="0.5" y="0.5" width="43" height="43" rx="3.5" fill="none"/>
                </g>
                <path id="menu" d="M.5,17a.5.5,0,0,1-.5-.5v-2A.5.5,0,0,1,.5,14h17a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5Zm0-7A.5.5,0,0,1,0,9.5v-2A.5.5,0,0,1,.5,7h17a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5Zm0-7A.5.5,0,0,1,0,2.5V.5A.5.5,0,0,1,.5,0h17a.5.5,0,0,1,.5.5v2a.5.5,0,0,1-.5.5Z" transform="translate(12 14)" fill="#112b4e"/>
                </g>
            </g>
            </svg>
            `;
            break;
        case 'icon_sorting':
            return `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="44" height="44" viewBox="0 0 44 44">
            <defs>
                <clipPath id="clip-icon_sorting">
                <rect width="44" height="44"/>
                </clipPath>
                <linearGradient id="a0">
                    <stop offset="0%" stop-color="#90ACDA"></stop>
                    <stop offset="100%" stop-color="#90ACDA"></stop>
                </linearGradient>
                <linearGradient id="a1">
                    <stop offset="0%" stop-color="#0545C7"></stop>
                    <stop offset="100%" stop-color="#90ACDA"></stop>
                </linearGradient>
                <linearGradient id="a2">
                    <stop offset="0%" stop-color="#90ACDA"></stop>
                    <stop offset="100%" stop-color="#0545C7"></stop>
                </linearGradient>
                <linearGradient id="arrow" x1="0" y1=".5" x2="0"  y2="0.6" xlink:href="#a0" />
                <linearGradient id="arrow_up" x1="0" y1=".5" x2="0"  y2="0.6" xlink:href="#a1" />
                <linearGradient id="arrow_down" x1="0" y1=".5" x2="0"  y2="0.6" xlink:href="#a2" />
            </defs>
            <g id="icon_sorting" clip-path="url(#clip-icon_sorting)">
                <g id="icon_sorting-2" data-name="icon_sorting">
                <rect id="bk" width="44" height="44" fill="none"/>
                <path id="Union_1" data-name="Union 1" d="M1476.529,20707.477l-3.331-3.332a.67.67,0,0,1,.478-1.143h6.652a.668.668,0,0,1,.473,1.143l-3.326,3.332a.67.67,0,0,1-.946,0Zm-2.853-7.807a.669.669,0,0,1-.478-1.143l3.331-3.332a.671.671,0,0,1,.946,0l3.326,3.332a.668.668,0,0,1-.473,1.143Z" transform="translate(-1455 -20679)" fill="url(#arrow)"/>
                </g>
            </g>
            </svg>
            `;
            break;
        
        default:
          return 'N/A';
      }




    
    
   
        



}


