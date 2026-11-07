import api from '@/api services/api';
import { PreviewRounded } from '@mui/icons-material';
import { Autocomplete, Box, Button, TextField } from '@mui/material';
import React, { type ChangeEvent } from 'react';

type createExcel_types = {
    name: string,
    sheetName?: string,
    rows?: Record<string, any>[],
    columns?: []
}

function CreateExcel() {

    const [data, setData] = React.useState<createExcel_types>({
        name: "",
        sheetName: "",
        rows: [],
        columns: []
    })

    const update_fields = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setData({ ...data, [name]: value })
    }

    const column_names = (value: string[]) => {
        setData(previousData => ({
            ...previousData,
            columns: value
        }))
    }

    const createExcel_fn = async () => {
        if (data.name) {
            const finalData = data.columns.map(item => ({

            }))
            const response = await api.post("/createExcel", data)
        }
    }

    return (
        <Box>
            <TextField
                label='Filename'
                name="name"
                value={data.name}
                onChange={update_fields}
                required
            />
            <TextField label="Sheet name(Optional)"
                name="sheetName"
                value={data.sheetName}
                onChange={update_fields}
            />

            <Autocomplete
                multiple
                freeSolo
                options={[]}
                value={data.columns}
                onChange={(_, value) => {
                    column_names(value)
                }}
                filterSelectedOptions
                slotProps={{
                    chip: {
                        'aria-description': "removeDescription",
                    },
                }}

                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Column names"
                        placeholder="Column names"
                    />
                )}

            />

            <Button onClick={createExcel_fn}>Submit</Button>
        </Box>
    )
}

export default CreateExcel