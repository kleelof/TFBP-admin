import React, {ChangeEvent, useEffect, useState} from 'react';
import recipeNoteService from '../../services/RecipeNoteService';
import recipeService from '../../services/RecipeService';
import { useHistory, useParams } from 'react-router-dom';
import RecipeNote from "../../models/RecipeNoteModel";
import LoadingOverlay from "../overlays/LoadingOverlay";
import Recipe from "../../models/RecipeModel";
import {LoadingIconButton} from "../widgets/loading_icon_button/LoadingIconButton";
import MomentHelper from "../../helpers/MomentHelper";

export const RecipeNotes = (): React.ReactElement => {
    const params: any = useParams();
    const history = useHistory();
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState(new Recipe());
    const [showAdd, setShowAdd] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        recipeService.get<Recipe>(params.id)
            .then((recipe: Recipe) => {
                setRecipe(recipe);
                setLoading(false);
            })
            .catch(() => {
                window.alert('unable to load notes');
                history.goBack();
            })
    }, [])
    if (loading)
        return <LoadingOverlay />

    const save = (): void => {
        setSaving(true);

        recipeNoteService.add<RecipeNote>(new RecipeNote(-1, newNote, recipe.id))
            .then((note: RecipeNote) => {
                setRecipe({
                    ...recipe,
                    notes: [note, ...recipe.notes]
                });
                setNewNote('');
                setShowAdd(false);
            })
            .catch(() => window.alert('unable to save note'))
            .then(() => {
                setSaving(false);
            })
    }

    return (
        <div className='row recipe_notes'>
            <div className='col-12'>
                <h3>recipe notes</h3>
                {recipe.name}
                <hr/>
            </div>
            <div className='col-12'>
                <button
                    className='btn btn-sm btn-outline-info'
                    onClick={() => history.goBack()}
                    >back</button>
                <button
                    className={`btn btn-sm btn-outline-${showAdd ? 'warning' : 'primary'} float-right`}
                    onClick={() => {
                        setShowAdd(!showAdd);
                        setNewNote('');
                    }}
                    >{showAdd ? 'cancel' : 'add'} note</button>
            </div>
            <div className='col-12'>
                <hr/>
            </div>
            {showAdd &&
                <div className='col-12'>
                    <div className='row justify-content-center'>
                        <div className='col-12 col-md-7 recipe_notes_add'>
                            <h5>note</h5>
                            <textarea
                                value={newNote}
                                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNewNote(e.target.value)}
                                className='form-control'
                                />
                            <LoadingIconButton
                                outerClass='float-right mt-2'
                                btnClass={`btn btn-sm btn-outline-${newNote.length === 0 ? 'secondary' : 'success'}`}
                                label='save'
                                onClick={save}
                                busy={saving}
                                disabled={newNote.length === 0}
                                />
                        </div>
                    </div>
                    <hr/>
                </div>
            }
            {
                recipe.notes.sort((a: RecipeNote, b: RecipeNote) => a.id > b.id ? -1 : a.id < b.id ? 1 : 0).map((note: RecipeNote) =>
                    <div className='col-12'>
                        <strong>{MomentHelper.asShortDateTime(note.created_at)}</strong>
                        <p className='mt-2'>{note.text}</p>
                        <hr/>
                    </div>
                )
            }
        </div>
    )
}