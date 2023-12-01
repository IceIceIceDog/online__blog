
import { useMemo, useCallback } from "react";
import { useSelector } from "react-redux";

export function useTheme(){
    
const theme = useSelector(state => state.theme.theme);

const components = useMemo(() => ['--body-background', '--color', '--contrast-color', '--hover-background',
'--contrast-hover', '--line-color', '--overlay-modal'
], []);


const changeTheme = useCallback(() => {
  const root = document.querySelector(':root');
  components.forEach(item => {
    root.style.setProperty(`${item}-default`, `var(${item}-${theme})`);
 });
}, [theme, components]);
  
return [theme, changeTheme];
}