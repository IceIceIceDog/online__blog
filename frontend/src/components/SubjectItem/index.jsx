
const SubjectItem = ({subject, selectSubject = null, classNames}) => {

  const { post_subject } = subject;

  const handleSelect = () => selectSubject && selectSubject(subject.postSubjectId);

  return (
    <span onClick={handleSelect} className={classNames}>{post_subject.subject_name}</span>
  )
}

export default SubjectItem