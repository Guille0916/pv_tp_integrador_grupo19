import { Link } from 'react-router-dom';

const BotonIcono = ({
  children,
  className = '',
  label,
  title = label,
  type = 'button',
  ...props
}) => {
  const Component = props.to ? Link : 'button';
  const atributosBoton = props.to ? {} : { type };

  return (
    <Component
      {...atributosBoton}
      {...props}
      aria-label={label}
      className={className}
      title={title}
    >
      {children}
    </Component>
  );
};

export default BotonIcono;
