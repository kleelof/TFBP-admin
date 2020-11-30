import React, {useState} from 'react';
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import menuCategoryService from '../../services/MenuCategoryService';
import {MenuCategory} from "../../models/MenuCategoryModel";
import {RestaurantMenuCategory} from "./RestaurantMenuCategory";

export const RestaurantMenuManager = (): React.ReactElement => {
    let timer: any;

    const [newCategory, setNewCategory] = useState('');
    const [addingCategory, setAddingCategory] = useState(false);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [openCategory, setOpenCategory] = useState<MenuCategory | null>(null);

    React.useEffect(() => {
        menuCategoryService.get<MenuCategory[]>()
            .then((categories: MenuCategory[]) => {
                setCategories(categories.sort((a: MenuCategory, b:MenuCategory) =>
                        a.index < b.index ? -1 : a.index > b.index ? 1 : 0
                    ));
            })
    }, [])

    const addCategory = (): void => {
        setAddingCategory(true);
        menuCategoryService.add<MenuCategory>(new MenuCategory(newCategory))
            .then((category: MenuCategory) => {
                setCategories([...categories, category]);
                setAddingCategory(false);
                setNewCategory('');
            })
            .catch( err => window.alert('unable to create category'))
    }

    const moveCategory = (direction: number, category: MenuCategory): void => {
        let cats: MenuCategory[] = categories.filter((cat: MenuCategory) => cat.id !== category.id);
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
        let cats: MenuCategory[] = categories.map((cat: MenuCategory, index: number) => {
            console.log(cat);
            cat.index = index;
            return cat;
        })
        menuCategoryService.updateIndexes(cats.map((cat: MenuCategory) => cat.id))
        console.log(cats);
        setCategories(cats);
    }

    return (
        <div className='row rest_menu_manager justify-content-center'>
            <div className='col-12'>
                <h3>menu manager</h3>
                <hr/>
            </div>
            <div className='col-9 col-md-6'>
                <input
                    className='form-control'
                    placeholder='new category name'
                    value={newCategory}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
                    />
            </div>
            <div className='col-2'>
                <LoadingIconButton
                    label='+'
                    onClick={addCategory}
                    busy={addingCategory}
                    btnClass='btn btn-sm btn-outline-success'
                    disabled={newCategory.length === 0}
                    />
            </div>
            <div className='col-12 col-md-7'>
                {
                    categories.map((category: MenuCategory) =>
                        <RestaurantMenuCategory
                            category={category}
                            move={moveCategory}
                            canMoveUp={category.index > 1}
                            canMoveDown={category.index < categories.length}
                            key={`category_${category.id}`}
                            isOpen={category.id === openCategory?.id}
                            categorySelected={(category: MenuCategory | null) => {
                                console.log(category)
                                setOpenCategory(category)
                            }}
                        />
                    )
                }
            </div>
        </div>
    )
}