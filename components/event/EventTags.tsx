interface IProps {
  tags: string[]
}

const EventTags = ({tags}: IProps) => {
  return (
    <div className={'flex flex-row gap-1.5 flex-wrap'}>
      {tags.map((tag) => (
        <div className={'pill'} key={tag}>{tag}</div>
      ))}
    </div>
  );
};
export default EventTags;
