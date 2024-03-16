import Link from "next/link";

const AnswerThread = ({ tags, title, time, comments, points, id }) => {

return (
    <Link href={`/thread/${id}`}>
        <div className='answer-grid-item'>
            <div className="answer-inner-grid-item">
            {/* <ul className='answer-tags'>
                {tags.map((tag, i) => (
                <li key={i}>{tag}</li>
                ))}
            </ul> */}
            <h4>{title}</h4>
            <div className='answer-bottom-container'>
            <h6>{time}hrs ago</h6>
            <p>{comments} Comments</p>
            {/* <p>{points} points</p> */}
            </div>
            </div>
        </div>
    </Link>
);
};

export default AnswerThread;