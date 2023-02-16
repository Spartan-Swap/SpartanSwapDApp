import { CheckIcon } from "@heroicons/react/20/solid";
import { classNames } from "../../utils/formatting";

const steps = [
  {
    // Check token1 && token2 approvals simulataneously and every X seconds
    name: "Approve Token1",
    description: "Allow Contract1 to handle your Token1",
    href: "#",
    status: "complete",
  },
  {
    // Check token1 && token2 approvals simulataneously and every X seconds
    name: "Approve Token2",
    description: "Allow Contract1 to handle your Token2",
    href: "#",
    status: "current",
  },
  {
    // After the previous 2 steps are complete:
    // Call API to get updated quote inc call data for swap (one time)
    // dont refresh every X seconds but supply manual refresh button for user
    // receive call data and final quote for user to confirm
    // optionally we can also dry-run the call to get an accurate gas estimate
    name: "Confirm Rate",
    description: "Confirm the estimated Token3 amount you will receive",
    href: "#",
    status: "upcoming",
  },
  {
    name: "Sign Transaction",
    description: "Sign and finalise the transaction",
    href: "#",
    status: "upcoming",
  },
];

export default function TxnProgress() {
  return (
    <nav aria-label="Progress">
      <ol role="list" className="overflow-hidden">
        {steps.map((step, stepIdx) => (
          <li
            key={step.name}
            className={classNames(
              stepIdx !== steps.length - 1 ? "pb-10" : "",
              "relative"
            )}
          >
            {step.status === "complete" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-indigo-600"
                    aria-hidden="true"
                  />
                ) : null}
                <a href={step.href} className="group relative flex items-start">
                  <span className="flex h-9 items-center">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 group-hover:bg-indigo-800">
                      <CheckIcon
                        className="h-5 w-5 text-white"
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-left text-sm font-medium text-indigo-600">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </a>
              </>
            ) : step.status === "current" ? (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <a
                  href={step.href}
                  className="group relative flex items-start"
                  aria-current="step"
                >
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-indigo-600 bg-white">
                      <span className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-left text-sm font-medium text-white">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </a>
              </>
            ) : (
              <>
                {stepIdx !== steps.length - 1 ? (
                  <div
                    className="absolute top-4 left-4 -ml-px mt-0.5 h-full w-0.5 bg-gray-300"
                    aria-hidden="true"
                  />
                ) : null}
                <a href={step.href} className="group relative flex items-start">
                  <span className="flex h-9 items-center" aria-hidden="true">
                    <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white group-hover:border-gray-400">
                      <span className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300" />
                    </span>
                  </span>
                  <span className="ml-4 flex min-w-0 flex-col">
                    <span className="text-left text-sm font-medium text-gray-300">
                      {step.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {step.description}
                    </span>
                  </span>
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
