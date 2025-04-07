interface LogoProps {
    logoSrc: string;
    altText?: string;
    className?: string;
    imgClassName?: string;
    textClassName?: string;
}

const Logo: React.FC<LogoProps> = ({ logoSrc, altText = 'logo', className = '', imgClassName = 'w-10 h-10', textClassName = '' }) => {
    return (
        <div className={`flex justify-center items-center ${className}`}>
        <img src={logoSrc} alt={altText} className={`select-none ${imgClassName}`} />
        <h2 className={`font-asap text-3xl font-semibold px-2 bg-gradient-to-r from-[#939FB4] to-[#B7BFCD] bg-clip-text text-transparent select-none ${textClassName}`}>
          App IoT
        </h2>
      </div>
    )
};

export default Logo;