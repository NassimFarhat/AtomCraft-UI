import { cn } from "@atomscraft/core";
import { forwardRef, useId } from "react";
import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { Button } from "../atoms/button";
import { Input } from "../atoms/input";
import { useControllableState } from "../hooks";
import { useAtomCraft } from "../provider";
import { SelectMenu } from "../molecules/select-menu";
import { Stepper } from "../molecules/stepper";

export type FilterOption = { value: string; label: string };
export type FilterDefinition = {
  id: string;
  label: string;
  value: string;
  options: readonly FilterOption[];
};
export type FilterBarProps = Omit<HTMLAttributes<HTMLFormElement>, "onChange"> & {
  query: string;
  onQueryChange: (query: string) => void;
  queryLabel: string;
  filters?: readonly FilterDefinition[];
  onFilterChange?: (id: string, value: string) => void;
  resetLabel: string;
  onReset?: () => void;
};

/** Search and facet controls; the owning screen filters its own dataset. */
export const FilterBar = forwardRef<HTMLFormElement, FilterBarProps>(function FilterBar(
  {
    query,
    onQueryChange,
    queryLabel,
    filters = [],
    onFilterChange,
    resetLabel,
    onReset,
    className,
    ...props
  },
  ref,
) {
  const queryId = useId();
  return (
    <form
      {...props}
      ref={ref}
      role="search"
      data-slot="filter-bar"
      className={cn("ac-filter-bar", className)}
    >
      <label className="ac-visually-hidden" htmlFor={queryId}>
        {queryLabel}
      </label>
      <Input
        id={queryId}
        type="search"
        placeholder={queryLabel}
        value={query}
        onChange={(event) => onQueryChange(event.target.value)}
        aria-label={queryLabel}
      />
      {filters.map((filter) => (
        <label key={filter.id} className="ac-filter-bar__facet">
          <span>{filter.label}</span>
          <SelectMenu
            options={filter.options}
            value={filter.value}
            onValueChange={(value) => {
              if (value !== null) onFilterChange?.(filter.id, value);
            }}
            aria-label={filter.label}
          />
        </label>
      ))}
      {onReset && (
        <Button type="button" variant="ghost" tone="neutral" onClick={onReset}>
          {resetLabel}
        </Button>
      )}
    </form>
  );
});

export type WizardStep = { id: string; label: string; description?: string; content: ReactNode };
export type WizardProps = Omit<HTMLAttributes<HTMLElement>, "onChange"> & {
  label: string;
  steps: readonly WizardStep[];
  step?: number;
  defaultStep?: number;
  onStepChange?: (step: number) => void;
  onComplete?: () => void;
  previousLabel: string;
  nextLabel: string;
  completeLabel: string;
};

/** Multi-step flow shell. The application owns form values and validation. */
export const Wizard = forwardRef<HTMLElement, WizardProps>(function Wizard(
  {
    label,
    steps,
    step,
    defaultStep = 1,
    onStepChange,
    onComplete,
    previousLabel,
    nextLabel,
    completeLabel,
    className,
    ...props
  },
  ref,
) {
  const safeStep = Math.min(Math.max(defaultStep, 1), Math.max(steps.length, 1));
  const [currentStep, setCurrentStep] = useControllableState({
    value: step,
    defaultValue: safeStep,
    onChange: onStepChange,
  });
  const index = Math.min(Math.max(currentStep - 1, 0), Math.max(steps.length - 1, 0));
  const current = steps[index];
  if (!current) return null;
  const isLast = index === steps.length - 1;
  return (
    <section
      {...props}
      ref={ref}
      data-slot="wizard"
      data-step={currentStep}
      className={cn("ac-wizard", className)}
    >
      <Stepper
        label={label}
        steps={steps.map(({ id, label: stepLabel, description }) => ({
          id,
          label: stepLabel,
          description,
        }))}
        currentStep={currentStep}
      />
      <div className="ac-wizard__panel" aria-live="polite">
        <h2 className="ac-wizard__title">{current.label}</h2>
        {current.content}
      </div>
      <div className="ac-wizard__actions">
        <Button
          type="button"
          variant="outline"
          tone="neutral"
          disabled={index === 0}
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
        >
          {previousLabel}
        </Button>
        {isLast ? (
          <Button type="button" onClick={onComplete}>
            {completeLabel}
          </Button>
        ) : (
          <Button
            type="button"
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
          >
            {nextLabel}
          </Button>
        )}
      </div>
    </section>
  );
});
export const MultiStepForm = Wizard;
export type MultiStepFormProps = WizardProps;

export type CarouselProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  items: readonly ReactNode[];
  index?: number;
  defaultIndex?: number;
  onIndexChange?: (index: number) => void;
  previousLabel: string;
  nextLabel: string;
  slideLabel: (index: number, total: number) => string;
  loop?: boolean;
};

export const Carousel = forwardRef<HTMLDivElement, CarouselProps>(function Carousel(
  {
    label,
    items,
    index,
    defaultIndex = 0,
    onIndexChange,
    previousLabel,
    nextLabel,
    slideLabel,
    loop = false,
    className,
    ...props
  },
  ref,
) {
  const [active, setActive] = useControllableState({
    value: index,
    defaultValue: defaultIndex,
    onChange: onIndexChange,
  });
  if (!items.length) return null;
  const current = Math.min(Math.max(active, 0), items.length - 1);
  const move = (direction: -1 | 1) =>
    setActive((previous) => {
      const next = previous + direction;
      return loop
        ? (next + items.length) % items.length
        : Math.min(Math.max(next, 0), items.length - 1);
    });
  return (
    <section
      {...props}
      ref={ref}
      role="region"
      aria-label={label}
      data-slot="carousel"
      className={cn("ac-carousel", className)}
    >
      <div className="ac-carousel__viewport" aria-live="polite">
        <div
          role="group"
          aria-label={slideLabel(current + 1, items.length)}
          className="ac-carousel__slide"
        >
          {items[current]}
        </div>
      </div>
      <div className="ac-carousel__controls">
        <Button
          type="button"
          variant="outline"
          tone="neutral"
          aria-label={previousLabel}
          disabled={!loop && current === 0}
          onClick={() => move(-1)}
        >
          {previousLabel}
        </Button>
        <span aria-hidden="true" className="ac-carousel__count">
          {current + 1} / {items.length}
        </span>
        <Button
          type="button"
          variant="outline"
          tone="neutral"
          aria-label={nextLabel}
          disabled={!loop && current === items.length - 1}
          onClick={() => move(1)}
        >
          {nextLabel}
        </Button>
      </div>
    </section>
  );
});

export type TimelineEvent = {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  time?: string;
  dateTime?: string;
  tone?: "neutral" | "success" | "warning" | "danger";
};
export type TimelineProps = Omit<HTMLAttributes<HTMLOListElement>, "children"> & {
  items: readonly TimelineEvent[];
};
export const Timeline = forwardRef<HTMLOListElement, TimelineProps>(function Timeline(
  { items, className, ...props },
  ref,
) {
  return (
    <ol {...props} ref={ref} data-slot="timeline" className={cn("ac-timeline", className)}>
      {items.map((item) => (
        <li key={item.id} data-tone={item.tone ?? "neutral"} className="ac-timeline__item">
          <span aria-hidden="true" className="ac-timeline__marker" />
          <div className="ac-timeline__body">
            <div className="ac-timeline__heading">
              <bdi>{item.title}</bdi>
              {item.time && (
                <time dateTime={item.dateTime} className="ac-timeline__time">
                  <bdi>{item.time}</bdi>
                </time>
              )}
            </div>
            {item.description && <p className="ac-timeline__description">{item.description}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
});
export const ActivityFeed = Timeline;
export type ActivityFeedProps = TimelineProps;

export type KanbanCard = { id: string; title: string; description?: string };
export type KanbanColumn = { id: string; title: string; cards: readonly KanbanCard[] };
export type KanbanProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  columns: readonly KanbanColumn[];
  moveLabel: string;
  onMoveCard?: (cardId: string, columnId: string) => void;
};
export const Kanban = forwardRef<HTMLDivElement, KanbanProps>(function Kanban(
  { label, columns, moveLabel, onMoveCard, className, ...props },
  ref,
) {
  return (
    <section
      {...props}
      ref={ref}
      aria-label={label}
      data-slot="kanban"
      className={cn("ac-kanban", className)}
    >
      {columns.map((column) => (
        <section key={column.id} aria-label={column.title} className="ac-kanban__column">
          <h2 className="ac-kanban__heading">
            {column.title}
            <span>{column.cards.length}</span>
          </h2>
          <ul className="ac-kanban__cards">
            {column.cards.map((card) => (
              <li key={card.id} className="ac-kanban__card">
                <strong>
                  <bdi>{card.title}</bdi>
                </strong>
                {card.description && <p>{card.description}</p>}
                {onMoveCard && (
                  <label className="ac-kanban__move">
                    <span className="ac-visually-hidden">
                      {card.title} {moveLabel}
                    </span>
                    <SelectMenu
                      value={column.id}
                      options={columns.map((item) => ({ value: item.id, label: item.title }))}
                      aria-label={`${card.title} ${moveLabel}`}
                      onValueChange={(value) => {
                        if (value !== null) onMoveCard?.(card.id, value);
                      }}
                    />
                  </label>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </section>
  );
});

export type ChartDatum = { label: string; value: number };
export type ChartProps = Omit<HTMLAttributes<HTMLElement>, "children"> & {
  label: string;
  categoryLabel: string;
  valueLabel: string;
  data: readonly ChartDatum[];
  type?: "bar" | "line";
};
export const Chart = forwardRef<HTMLElement, ChartProps>(function Chart(
  { label, categoryLabel, data, type = "bar", valueLabel, className, ...props },
  ref,
) {
  const width = 640;
  const height = 240;
  const inset = 20;
  const max = Math.max(1, ...data.map((item) => item.value));
  const points = data.map((item, index) => ({
    ...item,
    x: inset + (data.length < 2 ? 0 : (index * (width - inset * 2)) / (data.length - 1)),
    y: height - inset - (Math.max(0, item.value) / max) * (height - inset * 2),
  }));
  return (
    <figure
      {...props}
      ref={ref}
      data-slot="chart"
      data-type={type}
      className={cn("ac-chart", className)}
    >
      <figcaption className="ac-chart__caption">{label}</figcaption>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={label}
        className="ac-chart__plot"
        preserveAspectRatio="none"
      >
        <line
          x1={inset}
          y1={height - inset}
          x2={width - inset}
          y2={height - inset}
          className="ac-chart__axis"
        />
        {type === "line" ? (
          <>
            <polyline
              points={points.map(({ x, y }) => `${x},${y}`).join(" ")}
              className="ac-chart__line"
            />
            {points.map((point) => (
              <circle
                key={point.label}
                cx={point.x}
                cy={point.y}
                r="4"
                className="ac-chart__point"
              />
            ))}
          </>
        ) : (
          points.map((point, index) => (
            <rect
              key={point.label}
              x={inset + index * ((width - inset * 2) / Math.max(data.length, 1)) + 4}
              y={point.y}
              width={Math.max(2, (width - inset * 2) / Math.max(data.length, 1) - 8)}
              height={height - inset - point.y}
              rx="3"
              className="ac-chart__bar"
            />
          ))
        )}
      </svg>
      <table className="ac-visually-hidden">
        <caption>{label}</caption>
        <thead>
          <tr>
            <th scope="col">{categoryLabel}</th>
            <th scope="col">{valueLabel}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.label}>
              <th scope="row">
                <bdi>{item.label}</bdi>
              </th>
              <td>
                <bdi>{item.value}</bdi>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div aria-hidden="true" className="ac-chart__labels">
        {data.map((item) => (
          <span key={item.label}>
            <bdi>{item.label}</bdi>
          </span>
        ))}
      </div>
    </figure>
  );
});

export type MapMarker = { id: string; label: string; x: number; y: number; detail?: ReactNode };
export type MapProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  label: string;
  markers: readonly MapMarker[];
  imageSrc?: string;
  imageAlt?: string;
  onMarkerSelect?: (marker: MapMarker) => void;
};
export const Map = forwardRef<HTMLDivElement, MapProps>(function Map(
  { label, markers, imageSrc, imageAlt = "", onMarkerSelect, className, ...props },
  ref,
) {
  const { dir } = useAtomCraft();
  return (
    <div
      {...props}
      ref={ref}
      role="region"
      aria-label={label}
      data-slot="map"
      className={cn("ac-map", className)}
    >
      <div className="ac-map__canvas">
        {imageSrc ? (
          <img className="ac-map__image" src={imageSrc} alt={imageAlt} />
        ) : (
          <div aria-hidden="true" className="ac-map__surface" />
        )}
        {markers.map((marker) => (
          <button
            key={marker.id}
            type="button"
            aria-label={marker.label}
            className="ac-map__marker"
            style={
              {
                insetInlineStart: `${dir === "rtl" ? 100 - clampPercent(marker.x) : clampPercent(marker.x)}%`,
                insetBlockStart: `${clampPercent(marker.y)}%`,
              } as CSSProperties
            }
            onClick={() => onMarkerSelect?.(marker)}
          >
            <span aria-hidden="true" />
            {marker.detail && (
              <span className="ac-map__tooltip">
                <bdi>{marker.detail}</bdi>
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
});
export const MapView = Map;
export type MapViewProps = MapProps;

function clampPercent(value: number) {
  return Math.min(100, Math.max(0, value));
}
