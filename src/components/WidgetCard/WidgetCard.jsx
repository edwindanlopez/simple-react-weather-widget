import styles from './widgetCard.module.css';

export default function WidgetCard({ i, children }) {
	const activeCardStyles = `${styles.active} ${styles.card}`;
	return (
		<div className={i === 0 ? activeCardStyles : styles.card}>{children}</div>
	);
}
