import styles from "../../styles/Form.module.css";

function FormOptionButton({
  handleClick,
  label,
  selected,
}: {
  handleClick: () => void;
  label: string;
  selected: boolean;
}) {
  return (
    <button
      className={
        styles.optionButton + (selected ? " " + styles.option_selected : "")
      }
      onClick={handleClick}
    >
      {label}
    </button>
  );
}

export default FormOptionButton;
