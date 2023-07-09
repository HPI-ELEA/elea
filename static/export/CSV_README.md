# CSV Format
Each plot has its own CSV file.

## Single input plots
Each dataset is written in one column with the datasets name in the first row.

## Double input plots
Each dataset occupies two columns named datasetname_x, datasetname_y. 

# Display in python

## Single input plots 

To regenerate the plot in python you can run the following code:
```py
import pandas as pd 
df = pd.read_csv('fitness.csv',sep=';')
df.plot(kind='line')
```

## Double input plots

To recreate the plot in python you can run the following code:
```py
import pandas as pd
import matplotlib.pyplot as plt
df2 = pd.read_csv('fitness.csv', sep=';')
fig, ax = plt.subplots()

for i in range(1, len(df2.columns), 2):
    x_col = df2.columns[i-1]
    y_col = df2.columns[i]
    ax.plot(df2[x_col], df2[y_col], label=f'Dataset {i//2 + 1}')

ax.legend() 
plt.show()
```