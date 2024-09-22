import { render } from 'react-dom';
import * as React from 'react';
import { useState, useRef, useCallback } from 'react';
import { Link } from '@fluentui/react/lib/Link';
import {
  DetailsList,
  Selection,
  IColumn,
  buildColumns,
  IColumnReorderOptions,
  IDragDropEvents,
  IDragDropContext,
} from '@fluentui/react/lib/DetailsList';
import { MarqueeSelection } from '@fluentui/react/lib/MarqueeSelection';
import { createListItems, IExampleItem } from '@fluentui/example-data';
import { TextField, ITextFieldStyles } from '@fluentui/react/lib/TextField';
import { Toggle, IToggleStyles } from '@fluentui/react/lib/Toggle';
import { getTheme, mergeStyles } from '@fluentui/react/lib/Styling';

const theme = getTheme();
const margin = '0 30px 20px 0';
const dragEnterClass = mergeStyles({
  backgroundColor: theme.palette.neutralLight,
});
const controlWrapperClass = mergeStyles({
  display: 'flex',
  flexWrap: 'wrap',
});
const textFieldStyles: Partial<ITextFieldStyles> = {
  root: { margin },
  fieldGroup: { maxWidth: '100px' },
};
const togglesStyles: Partial<IToggleStyles> = { root: { margin } };

interface IDetailsListDragDropExampleState {
  items: IExampleItem[];
  columns: IColumn[];
  isColumnReorderEnabled: boolean;
  frozenColumnCountFromStart: string;
  frozenColumnCountFromEnd: string;
}

// export class App extends React.Component<{}, IDetailsListDragDropExampleState> {
//   private _selection: Selection;
//   private _dragDropEvents: IDragDropEvents;
//   private _draggedItem: IExampleItem | undefined;
//   private _draggedIndex: number;

//   constructor(props: {}) {
//     super(props);

//     this._selection = new Selection();
//     this._dragDropEvents = this._getDragDropEvents();
//     this._draggedIndex = -1;
//     const items = createListItems(10, 0);

//     this.state = {
//       items,
//       columns: buildColumns(items, true),
//       isColumnReorderEnabled: true,
//       frozenColumnCountFromStart: '1',
//       frozenColumnCountFromEnd: '0',
//     };
//   }

//   public render(): JSX.Element {
//     const {
//       items,
//       columns,
//       isColumnReorderEnabled,
//       frozenColumnCountFromStart,
//       frozenColumnCountFromEnd,
//     } = this.state;

//     return (
//       <div>
//         {/* <div className={controlWrapperClass}>
//           <Toggle
//             label="Enable column reorder"
//             checked={isColumnReorderEnabled}
//             onChange={this._onChangeColumnReorderEnabled}
//             onText="Enabled"
//             offText="Disabled"
//             styles={togglesStyles}
//           />
//           <TextField
//             label="Number of left frozen columns"
//             onGetErrorMessage={this._validateNumber}
//             value={frozenColumnCountFromStart}
//             onChange={this._onChangeStartCountText}
//             styles={textFieldStyles}
//           />
//           <TextField
//             label="Number of right frozen columns"
//             onGetErrorMessage={this._validateNumber}
//             value={frozenColumnCountFromEnd}
//             onChange={this._onChangeEndCountText}
//             styles={textFieldStyles}
//           />
//         </div> */}
//         <MarqueeSelection selection={this._selection}>
//           <DetailsList
//             setKey="items"
//             items={items}
//             columns={columns}
//             selection={this._selection}
//             selectionPreservedOnEmptyClick={true}
//             onRenderItemColumn={this._onRenderItemColumn}
//             dragDropEvents={this._dragDropEvents}
//             columnReorderOptions={
//               this.state.isColumnReorderEnabled
//                 ? this._getColumnReorderOptions()
//                 : undefined
//             }
//             ariaLabelForSelectionColumn="Toggle selection"
//             ariaLabelForSelectAllCheckbox="Toggle selection for all items"
//             checkButtonAriaLabel="select row"
//           />
//         </MarqueeSelection>
//       </div>
//     );
//   }

//   private _handleColumnReorder = (
//     draggedIndex: number,
//     targetIndex: number
//   ) => {
//     const draggedItems = this.state.columns[draggedIndex];
//     const newColumns: IColumn[] = [...this.state.columns];

//     // insert before the dropped item
//     newColumns.splice(draggedIndex, 1);
//     newColumns.splice(targetIndex, 0, draggedItems);
//     this.setState({ columns: newColumns });
//   };

//   private _getColumnReorderOptions(): IColumnReorderOptions {
//     return {
//       frozenColumnCountFromStart: parseInt(
//         this.state.frozenColumnCountFromStart,
//         10
//       ),
//       frozenColumnCountFromEnd: parseInt(
//         this.state.frozenColumnCountFromEnd,
//         10
//       ),
//       handleColumnReorder: this._handleColumnReorder,
//     };
//   }

//   private _validateNumber(value: string): string {
//     return isNaN(Number(value))
//       ? `The value should be a number, actual is ${value}.`
//       : '';
//   }

//   private _onChangeStartCountText = (
//     event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
//     text: string
//   ): void => {
//     this.setState({ frozenColumnCountFromStart: text });
//   };

//   private _onChangeEndCountText = (
//     event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
//     text: string
//   ): void => {
//     this.setState({ frozenColumnCountFromEnd: text });
//   };

//   private _onChangeColumnReorderEnabled = (
//     ev: React.MouseEvent<HTMLElement>,
//     checked: boolean
//   ): void => {
//     this.setState({ isColumnReorderEnabled: checked });
//   };

//   private _getDragDropEvents(): IDragDropEvents {
//     return {
//       canDrop: (
//         dropContext?: IDragDropContext,
//         dragContext?: IDragDropContext
//       ) => {
//         return true;
//       },
//       canDrag: (item?: any) => {
//         return true;
//       },
//       onDragEnter: (item?: any, event?: DragEvent) => {
//         // return string is the css classes that will be added to the entering element.
//         return dragEnterClass;
//       },
//       onDragLeave: (item?: any, event?: DragEvent) => {
//         return;
//       },
//       onDrop: (item?: any, event?: DragEvent) => {
//         if (this._draggedItem) {
//           this._insertBeforeItem(item);
//         }
//       },
//       onDragStart: (
//         item?: any,
//         itemIndex?: number,
//         selectedItems?: any[],
//         event?: MouseEvent
//       ) => {
//         this._draggedItem = item;
//         this._draggedIndex = itemIndex!;
//       },
//       onDragEnd: (item?: any, event?: DragEvent) => {
//         this._draggedItem = undefined;
//         this._draggedIndex = -1;
//       },
//     };
//   }

//   private _onRenderItemColumn = (
//     item: IExampleItem,
//     index: number,
//     column: IColumn
//   ): JSX.Element | string => {
//     const key = column.key as keyof IExampleItem;
//     if (key === 'name') {
//       return (
//         <Link data-selection-invoke={true} underline>
//           {item[key]}
//         </Link>
//       );
//     }

//     return String(item[key]);
//   };

//   private _insertBeforeItem(item: IExampleItem): void {
//     const draggedItems = this._selection.isIndexSelected(this._draggedIndex)
//       ? (this._selection.getSelection() as IExampleItem[])
//       : [this._draggedItem!];

//     const insertIndex = this.state.items.indexOf(item);
//     const items = this.state.items.filter(
//       (itm) => draggedItems.indexOf(itm) === -1
//     );

//     items.splice(insertIndex, 0, ...draggedItems);

//     this.setState({ items });
//   }
// }

const App: React.FC = () => {
  const [items, setItems] = useState<IExampleItem[]>(createListItems(10, 0));
  const [columns, setColumns] = useState<IColumn[]>(buildColumns(items, true));
  const [isColumnReorderEnabled, setIsColumnReorderEnabled] = useState(true);
  const [frozenColumnCountFromStart, setFrozenColumnCountFromStart] =
    useState('1');
  const [frozenColumnCountFromEnd, setFrozenColumnCountFromEnd] = useState('0');

  const selectionRef = useRef(new Selection());
  const draggedItemRef = useRef<IExampleItem | undefined>(undefined);
  const draggedIndexRef = useRef<number>(-1);

  const handleColumnReorder = useCallback(
    (draggedIndex: number, targetIndex: number) => {
      const draggedItems = columns[draggedIndex];
      const newColumns = [...columns];
      newColumns.splice(draggedIndex, 1);
      newColumns.splice(targetIndex, 0, draggedItems);
      setColumns(newColumns);
    },
    [columns]
  );

  const getColumnReorderOptions = (): IColumnReorderOptions => {
    return {
      frozenColumnCountFromStart: parseInt(frozenColumnCountFromStart, 10),
      frozenColumnCountFromEnd: parseInt(frozenColumnCountFromEnd, 10),
      handleColumnReorder,
    };
  };

  const validateNumber = (value: string): string => {
    return isNaN(Number(value))
      ? `The value should be a number, actual is ${value}.`
      : '';
  };

  const onChangeStartCountText = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string
  ): void => {
    setFrozenColumnCountFromStart(text);
  };

  const onChangeEndCountText = (
    event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    text: string
  ): void => {
    setFrozenColumnCountFromEnd(text);
  };

  const onChangeColumnReorderEnabled = (
    ev: React.MouseEvent<HTMLElement>,
    checked: boolean
  ): void => {
    setIsColumnReorderEnabled(checked);
  };

  const getDragDropEvents = (): IDragDropEvents => {
    return {
      canDrop: (
        dropContext?: IDragDropContext,
        dragContext?: IDragDropContext
      ) => true,
      canDrag: (item?: any) => true,
      onDragEnter: (item?: any, event?: DragEvent) => {
        return dragEnterClass;
      },
      onDragLeave: (item?: any, event?: DragEvent) => {
        return;
      },
      onDrop: (item?: any, event?: DragEvent) => {
        if (draggedItemRef.current) {
          insertBeforeItem(item);
        }
      },
      onDragStart: (
        item?: any,
        itemIndex?: number,
        selectedItems?: any[],
        event?: MouseEvent
      ) => {
        draggedItemRef.current = item;
        draggedIndexRef.current = itemIndex!;
      },
      onDragEnd: (item?: any, event?: DragEvent) => {
        draggedItemRef.current = undefined;
        draggedIndexRef.current = -1;
      },
    };
  };

  const insertBeforeItem = (item: IExampleItem): void => {
    const draggedItems = selectionRef.current.isIndexSelected(
      draggedIndexRef.current
    )
      ? (selectionRef.current.getSelection() as IExampleItem[])
      : [draggedItemRef.current!];

    const insertIndex = items.indexOf(item);
    const updatedItems = items.filter(
      (itm) => draggedItems.indexOf(itm) === -1
    );

    updatedItems.splice(insertIndex, 0, ...draggedItems);
    setItems(updatedItems);
  };

  const onRenderItemColumn = (
    item: IExampleItem,
    index: number,
    column: IColumn
  ): JSX.Element | string => {
    const key = column.key as keyof IExampleItem;
    if (key === 'name') {
      return (
        <Link data-selection-invoke={true} underline>
          {item[key]}
        </Link>
      );
    }
    return String(item[key]);
  };

  return (
    <div>
      {/* <div className={controlWrapperClass}>
        <Toggle
          label="Enable column reorder"
          checked={isColumnReorderEnabled}
          onChange={onChangeColumnReorderEnabled}
          onText="Enabled"
          offText="Disabled"
          styles={togglesStyles}
        />
        <TextField
          label="Number of left frozen columns"
          onGetErrorMessage={validateNumber}
          value={frozenColumnCountFromStart}
          onChange={onChangeStartCountText}
          styles={textFieldStyles}
        />
        <TextField
          label="Number of right frozen columns"
          onGetErrorMessage={validateNumber}
          value={frozenColumnCountFromEnd}
          onChange={onChangeEndCountText}
          styles={textFieldStyles}
        />
      </div> */}
      <MarqueeSelection selection={selectionRef.current}>
        <DetailsList
          setKey="items"
          items={items}
          columns={columns}
          selection={selectionRef.current}
          selectionPreservedOnEmptyClick={true}
          onRenderItemColumn={onRenderItemColumn}
          dragDropEvents={getDragDropEvents()}
          columnReorderOptions={
            isColumnReorderEnabled ? getColumnReorderOptions() : undefined
          }
          ariaLabelForSelectionColumn="Toggle selection"
          ariaLabelForSelectAllCheckbox="Toggle selection for all items"
          checkButtonAriaLabel="select row"
        />
      </MarqueeSelection>
    </div>
  );
};

render(<App />, document.getElementById('root'));
