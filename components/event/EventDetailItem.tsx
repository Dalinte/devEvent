import Image from 'next/image';

interface IProps {
  icon: string
  alt: string
  label: string
}

const EventDetailItem = (props: IProps) => {
  return <div className={'flex-row-gap-2 items-center'}>
    <Image src={props.icon} alt={props.alt} width={17} height={17}/>
    <p>{props.label}</p>
  </div>
}

export default EventDetailItem;