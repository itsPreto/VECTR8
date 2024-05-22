import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useLocation } from 'react-router-dom';
import './Transition.css';

const Transition = ({ children, direction }) => {
  const location = useLocation();
  const classNames = direction === 'forward' ? 'slide' : 'slide-reverse';

  return (
    <TransitionGroup>
      <CSSTransition
        key={location.key}
        timeout={{ enter: 300, exit: 300 }}
        classNames={classNames}
      >
        {children}
      </CSSTransition>
    </TransitionGroup>
  );
};

export default Transition;
