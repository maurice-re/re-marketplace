import Image from "next/image";
import styles from "../../styles/Form.module.css";

function FormCircleButton({
  handleClick,
  title,
  selected,
  image,
  icon,
}: {
  handleClick: () => void;
  title: string;
  selected: boolean;
  image?: string;
  icon?: boolean;
}) {
  console.log(icon);
  return (
    <button className={styles.circleButton} onClick={handleClick}>
      <div
        className={
          styles.circle + " " + (selected ? styles.circle_selected : "")
        }
      >
        {image ? (
          <Image
            src={image}
            height={icon ? 100 : 200}
            width={icon ? 100 : 200}
            objectFit={"cover"}
            style={{ borderRadius: icon ? 0 : "50%" }}
          />
        ) : (
          <Image src={"/"} height={100} width={100} />
        )}
      </div>
      <p className={styles.itemTitle}>{title}</p>
    </button>
  );
}

export default FormCircleButton;
