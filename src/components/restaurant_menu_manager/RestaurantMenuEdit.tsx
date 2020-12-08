import React, {ChangeEvent, useState, Fragment} from 'react';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import menuCategoryService from '../../services/MenuCategoryService';
import {MenuCategory} from "../../models/MenuCategoryModel";
import {RestaurantMenuCategory} from "./RestaurantMenuCategory";
import { useParams, useHistory } from 'react-router-dom';
import deliveryDayService from '../../services/DeliveryDayService';
import DeliveryDay from "../../models/DeliveryDayModel";
import SearchWidget from "../widgets/searchWidget/SearchWidget";
import DeliveryDayMenuCategory from "../../models/DeliveryDayMenuCategory";

export const RestaurantMenuEdit = (): React.ReactElement => {
    let timer: any;

    const params: any = useParams();
    const history = useHistory();
    const [newCategory, setNewCategory] = useState<MenuCategory | string | undefined>(undefined);
    const [addingCategory, setAddingCategory] = useState(false);
    const [categories, setCategories] = useState<DeliveryDayMenuCategory[]>([]);
    const [openCategory, setOpenCategory] = useState<DeliveryDayMenuCategory | null>(null);
    const [deliveryDay, updateDeliveryDay] = useState(new DeliveryDay());
    const [savingDeliveryDay, setSavingDeliveryDay] = useState(false);

    React.useEffect(() => {
        deliveryDayService.get<DeliveryDay>(params.id)
            .then((deliveryDay: DeliveryDay) => {
                updateDeliveryDay(deliveryDay);
                setCategories(deliveryDay.categories)
            })
    }, [])

    const addCategory = (): void => {
        setAddingCategory(true);
        deliveryDayService.attachCategory(deliveryDay, newCategory as any)
            .then((category: DeliveryDayMenuCategory) => {
                setCategories([...categories, category]);
                setAddingCategory(false);
                setNewCategory(new MenuCategory());
            })
            .catch( err => window.alert('unable to create category'))
    }

    const categorySelected = (category: MenuCategory | string): void => {
        setNewCategory(category);
    }

    const moveCategory = (direction: number, category: DeliveryDayMenuCategory): void => {
        let cats: DeliveryDayMenuCategory[] = categories.filter((cat: DeliveryDayMenuCategory) => cat.id !== category.id);
        cats.splice(category.index + direction - 1, 0, category);
        // cats.forEach((cat: MenuCategory, index: number) => cat.index = index + 1)
        setCategories(cats);
        console.log(cats);
        resetTimer()
    }

    const resetTimer = (): void => {
        clearTimeout(timer);
        timer = setTimeout(submitUpdatedIndexes, 5000)
    };

    const submitUpdatedIndexes = (): void => {
        clearInterval(timer);
        console.log(categories);
        let cats: DeliveryDayMenuCategory[] = categories.map((cat: DeliveryDayMenuCategory, index: number) => {
            console.log(cat);
            cat.index = index;
            return cat;
        })
        menuCategoryService.updateIndexes(cats.map((cat: DeliveryDayMenuCategory) => cat.id))
        setCategories(cats);
    }

    const saveDeliveryDay = (): void => {
        if (deliveryDay.date > deliveryDay.end_date ||
            (!deliveryDay.is_perpetual &&
                (deliveryDay.date === '' || deliveryDay.end_date === ''))) {
            window.alert('invalid dates');
            return;
        }

        if (deliveryDay.name === '') {
            window.alert('enter a name for this menu');
            return;
        }

        setSavingDeliveryDay(true);
        deliveryDayService.update<DeliveryDay>(deliveryDay)
            .then((delDay: DeliveryDay) => {
                updateDeliveryDay(delDay);
                setSavingDeliveryDay(false);
            })
    }

    return (
        <div className='row rest_menu_manager justify-content-center'>
            <div className='col-12 col-md-7'>
                <div className='row'>
                    <div className='col-12'>
                        <h3>edit menu</h3>
                        <hr/>
                    </div>
                    <div className='col-12'>
                        <button
                            className='btn btn-sm btn-outline-info'
                            onClick={() => history.goBack()}
                            >back</button>
                        <hr/>
                    </div>
                    <div className='col-12'>
                        <div className='row'>
                            <div className='col-12 mb-2'>
                                <input
                                    className='form-control'
                                    placeholder='menu name'
                                    value={deliveryDay.name}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        updateDeliveryDay({...deliveryDay, name: e.target.value})
                                    }
                                    />
                            </div>
                            <div className='col-6 col-md-3'>
                                <div className="checkbox_selector">
                                    <input
                                        type='checkbox'
                                        checked={deliveryDay.is_perpetual}
                                        onClick={() => updateDeliveryDay({...deliveryDay, is_perpetual: !deliveryDay.is_perpetual})}
                                        />
                                    <span>perpetual</span>
                                </div>
                            </div>
                            <div className='col-6 col-md-9 text-right'>
                                <LoadingIconButton
                                    label='save'
                                    busy={savingDeliveryDay}
                                    btnClass="btn btn-sm btn-outline-success"
                                    outerClass='ml-2 mt-2 mt-m-0'
                                    onClick={saveDeliveryDay}
                                    disabled={savingDeliveryDay}
                                    />
                            </div>
                            {!deliveryDay.is_perpetual &&
                                <Fragment>
                                    <div className='col-12 col-md-6'>
                                        <small>start date:</small>
                                        <br/>
                                        <input
                                            type="date"
                                            id="startDate"
                                            value={deliveryDay.date}
                                            disabled={savingDeliveryDay || deliveryDay.is_perpetual}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                updateDeliveryDay({...deliveryDay, date: e.target.value})
                                            } />
                                    </div>
                                    <div className='col-12 col-md-6'>
                                        <small>end date:</small>
                                        <br/>
                                        <input
                                            className={'ml-2'}
                                            type="date"
                                            id="endDate"
                                            value={deliveryDay.end_date}
                                            disabled={savingDeliveryDay || deliveryDay.is_perpetual}
                                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                                updateDeliveryDay({...deliveryDay, end_date: e.target.value})
                                            } />
                                    </div>
                                </Fragment>
                            }
                        </div>
                        <hr/>
                    </div>
                    <div className='col-12'>
                        <h6>categories</h6>
                    </div>
                    <div className='col-9'>
                        <SearchWidget
                            placeholder='add category name'
                            serviceFunction={menuCategoryService.pagedSearchResults}
                            itemSelected={categorySelected}
                            />
                    </div>
                    <div className='col-3'>
                        <LoadingIconButton
                            label='+'
                            onClick={addCategory}
                            busy={addingCategory}
                            btnClass='btn btn-sm btn-outline-success'
                            disabled={newCategory === undefined}
                            />
                    </div>
                    <div className='col-12 mt-2'>
                        {
                            categories.map((category: DeliveryDayMenuCategory) =>
                                <RestaurantMenuCategory
                                    deliveryDay={deliveryDay}
                                    category={category}
                                    move={moveCategory}
                                    canMoveUp={category.index > 1}
                                    canMoveDown={category.index < categories.length}
                                    key={`category_${category.id}`}
                                    isOpen={category.id === openCategory?.id}
                                    categorySelected={(category: DeliveryDayMenuCategory | null) => setOpenCategory(category)}
                                />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}