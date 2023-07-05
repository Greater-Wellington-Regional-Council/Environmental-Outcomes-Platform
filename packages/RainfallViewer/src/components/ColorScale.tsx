import clsx from 'clsx';

type Props = {
  viewParams: ViewParams;
};

const SiteIcon = ({ className }: { className: string }) => (
  <svg className={clsx('h-2.5 w-2.5', className)} viewBox="0 0 10 10">
    <circle cx={5} cy={5} r={5} />
  </svg>
);

function keyLabel(colorScale: Array<[number | null, string]>, index: number) {
  if (index === 0) {
    return ``;
  }
  if (index === colorScale.length - 1) {
    return `${colorScale[index - 1][0]}`;
  }
  return `${colorScale[index - 1][0]}`;
}

export default function ColorScale({ viewParams }: Props) {
  return (
    <div className="flex-col items-center text-xs text-gray-800 rounded p-2 bg-gray-50 bg-opacity-40">
      <div className="grow flex flex-col-reverse mb-2">
        <div className="text-right -mt-3 mr-1">mm</div>
        {viewParams.colorScale.map(([number, color], index) => (
          <div className="h-4 flex" key={color}>
            <div
              className={clsx('w-5', index > 0 && 'border-b border-gray-400')}
              key={color}
              style={{ backgroundColor: color }}
            ></div>
            {index > 0 && <div className="border-b border-gray-400 w-3" />}
            <div className="pt-1.5 ml-0.5">
              {keyLabel(viewParams.colorScale, index)}
            </div>
          </div>
        ))}
      </div>
      <div>
        <div>
          <SiteIcon className="fill-red-600 opacity-60 inline mr-2 mb-1" />
          No data
        </div>
        <div>
          <SiteIcon className="fill-gray-600 opacity-60 inline mr-2 mb-1" />
          No rain
        </div>
      </div>
    </div>
  );
}
