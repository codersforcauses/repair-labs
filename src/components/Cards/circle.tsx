type Props = {
  numberOfTasks?: number;
};

export default function Circle({ numberOfTasks }: Props) {
  return (
    <span className="text-center text-lg font-semibold text-white inline-block rounded-full bg-app-primary w-8 h-8 leading-8">
      {numberOfTasks ?? ""}
    </span>
  );
}
