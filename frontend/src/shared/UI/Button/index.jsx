import { motion } from 'framer-motion';
import cl from './Button.module.scss';

const Button = ({children, styles = "default",  ...props}) => {
  
  return (
    <motion.button 
    whileTap={{scale: 1.1}}
    {...props} className={styles === 'default' ? cl.default__button : cl.inverse__button}>{children}
    </motion.button>
  )
}

export default Button