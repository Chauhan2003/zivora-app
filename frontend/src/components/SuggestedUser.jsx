import User from "./User";

const SuggestedUser = ({ suggestedUsers }) => {
  return (
    <div className="w-full">
      <div className="flex items-center">
        <span className="text-sm font-semibold text-black dark:text-white">
          Suggested for you
        </span>
      </div>

      <div className="mt-3 flex flex-col gap-3 w-full">
        {suggestedUsers.map((user, index) => (
          <User key={index} user={user} />
        ))}
      </div>
    </div>
  );
};

export default SuggestedUser;
