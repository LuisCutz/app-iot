import BoxIcon from "./BoxIcon";

interface WeatherCardProps {
    name: string;
    value: string;
    icon: string;
    iconType?: 'solid' | 'regular' | 'logo';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
    name, 
    value, 
    icon, 
    iconType = 'regular',
    size = 'md',
    className = ''
}) => {
    const sizeClasses = {
        sm: {
            container: 'p-3',
            icon: 'sm mb-2',
            title: 'text-sm mb-1',
            value: 'text-base'
        },
        md: {
            container: 'p-4',
            icon: 'md mb-3',
            title: 'text-base mb-2',
            value: 'text-xl'
        },
        lg: {
            container: 'p-6',
            icon: 'lg mb-4',
            title: 'text-xl mb-2',
            value: 'text-3xl'
        }
    };

    const classes = sizeClasses[size];

    return (
        <div className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl flex flex-col items-center justify-center transition-all duration-300 hover:bg-white/20 ${classes.container} ${className}`}>
            <BoxIcon
                type={iconType}
                name={icon}
                size={classes.icon}
                color='#f0f0f0'
            />
            <h3 className={`font-medium text-gray-200 ${classes.title}`}>{name}</h3>
            <p className={`font-bold text-white ${classes.value}`}>{value}</p>
        </div>
    )
}

export default WeatherCard;