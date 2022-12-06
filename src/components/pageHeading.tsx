export type ButtonProps = {
  label: string;
  link: string;
};

export type PageHeadingProps = {
  title: string;
  button1: ButtonProps;
  button2: ButtonProps;
};

export default function PageHeading({
  title,
  button1,
  button2,
}: PageHeadingProps) {
  return (
    <div className="bg-white p-4 md:flex md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 text-black sm:truncate sm:text-3xl sm:tracking-tight">
          {title}
        </h2>
      </div>
      <div className="mt-4 flex md:mt-0 md:ml-4">
        {button1 && (
          <button
            type="button"
            className="inline-flex items-center rounded-md border border-transparent bg-gray-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {button1.label}
          </button>
        )}
        {button2 && (
          <button
            type="button"
            className="ml-3 inline-flex items-center rounded-md border border-transparent bg-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {button2.label}
          </button>
        )}
      </div>
    </div>
  );
}
