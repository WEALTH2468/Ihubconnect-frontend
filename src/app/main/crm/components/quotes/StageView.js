export default function StageView({ stageStatus }) {
  return (
    <div
      className={`${
        stageStatus ? 'bg-green-500 ' : 'bg-red-500 '
      } w-[100%] mx-auto flex items-center justify-center py-1 `}
    >
      {stageStatus ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="#fff"
          className="w-24 h-24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.3em"
          height="1.3em"
          className="flex justify-center items-center"
        >
          <path
            fill="white"
            d="M2 7.75A.75.75 0 0 1 2.75 7h10a.75.75 0 0 1 0 1.5h-10A.75.75 0 0 1 2 7.75"
          />
        </svg>
      )}
    </div>
  );
}
