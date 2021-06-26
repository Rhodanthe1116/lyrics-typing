import { FC } from 'react'

interface Props {
  open: boolean
  severity: string
  onClose: () => void
  timeout: number
}

const Snackbar: FC<Props> = ({ open, onClose, children }) => {
  if (!open) {
    return <></>
  }
  return (
    <div className="bg-red-600 shadow flex justify-center items-center fixed z-50 bottom-4 left-1/2 transform -translate-x-1/2 h-auto px-2 py-4 rounded-xl border-transparent ">
      <p>{children}</p>
      <button onClick={onClose}>X</button>
    </div>
  )
}

// const Button = styled.button`
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   margin-left: 0.875rem;
//   padding: 0;
//   margin-left: 1rem;
//   height: 1.75rem;
//   width: 1.75rem;
//   text-align: center;
//   border: none;
//   border-radius: 50%;
//   background-color: transparent;
//   color: white;
//   cursor: pointer;

//   &:hover {
//     background-color: hsl(200, 100%, 60%);
//   }
// `

// const Container = styled.div`
//   position: fixed;
//   z-index: 1000;
//   bottom: 1rem;
//   left: 50%;
//   transform: translateX(-50%);
//   height: auto;
//   padding: 0.625rem 1rem;
//   border-radius: 0.75rem;
//   border: transparent;
//   background-color: hsl(200, 100%, 65%);
//   color: white;
//   box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);

//   display: flex;
//   justify-content: center;
//   align-items: center;

//   animation: ${fadein} 0.5s, ${fadeout} 0.5s ${(props) => props.time};
// `

// const fadein = keyframes`
//     from {
//       bottom: 0;
//       opacity: 0;
//     }
//     to {
//       bottom: 1rem;
//       opacity: 1;
//     }
// `

// const fadeout = keyframes`
//     from {
//       bottom: 1rem;
//       opacity: 1;
//     }
//     to {
//       bottom: 0;
//       opacity: 0;
//     }
// `

export default Snackbar
