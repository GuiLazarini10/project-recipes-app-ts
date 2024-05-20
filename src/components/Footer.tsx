import drinkIcon from '../images/drinkIcon.svg';
import mealIcon from '../images/mealIcon.svg';

function Footer(): JSX.Element {
  return (
    <div
      data-testid="footer"
      style={ {
        width: '100%',
        position: 'fixed',
        bottom: 0,
        display: 'flex',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        boxShadow: '0px -2px 10px rgba(0,0,0,0.1)',
        padding: '10px 0',
        zIndex: 1000,
        height: '60px',
      } }
    >
      <a href="/drinks">
        <img data-testid="drinks-bottom-btn" src={ drinkIcon } alt="Drinks" />
      </a>
      <a href="/meals">
        <img data-testid="meals-bottom-btn" src={ mealIcon } alt="Meals" />
      </a>
    </div>
  );
}

export default Footer;
