# Technology and Sports
Athletes have definitely improved over the years. They are fitter, follow strict nutitional guidelines,
and have access to better resources than athletes of the past.

However, the role of technology in this improvement is often forgotten. Technology in sports is not limited to
electronic scoreboards or cameras to record every detail. Material technology and sports equipment have developed
significantly over the years and have helped athletes improve.

The aim of this visualization is to shed light on some innovations in golf, swimming, and running, and raise awareness about "technological doping".

This project was developed by The Vaporflies (Ross Cefalu, Shourya Khare, Sophie Handel, & Tyler Jones) as the final project in CS 4460: Introduction to Information Visualization course in Spring 2020 at Georgia Institute of Technology. Recommended browsers are Google Chrome and Mozilla Firefox.

## Visualization Design
The visualization uses the "scrollytelling" technique, along with simple and meaningful graphs, to convey a message to the user using our data. All the plots are interactable to give the user more freedom to explore on their own.

![Golf line plot](https://raw.githubusercontent.com/shouryakhare98/cs4460/master/images/preview1.png)

The golf graph is a line graph plotting the average drive distance in 4 major golf tournaments from 1980 to 2019. Significant innovations in the sport are marked with tee flags. Hovering over a flag will reveal the name and year of that innovation. Users can add and remove lines corresponding to each innovation using the checkboxes above the graph.

![Swim scatter plot](https://raw.githubusercontent.com/shouryakhare98/cs4460/master/images/preview2.png)

The swim graph is a scatter graph plotting the 25 fastest times in 5 different swim events at official competitions. This graph shows the impact of the Speedo LZR full body suit. The release and banning of the suit are marked with pool lane dividers. Hovering over the dividers will reveal the release and banning of the suit along with the year. Additionally, hovering over the dots will reveal the name and time of the swimmer, and whether the full body suit was used by the swimmer to break the record.

![Running tiles](https://raw.githubusercontent.com/shouryakhare98/cs4460/master/images/preview3.png)

The final visualization is the running visualization. It is comprised of 6 tiles that represet key facts about the Nike Vaporfly shoe series. Hovering over each tile will reveal the fact. Clicking on the tile will lead to the source of that fact.

## Viewing the Visualization
The easiest way to view the visualization is to go to [this Github Pages link](https://shouryakhare98.github.io/cs4460).

To view the visualization locally, follow the steps below:
1. Use [this link](https://github.com/shouryakhare98/cs4460/archive/master.zip) to download a zipped version of the repository. Unzip the repository at a destination of your choice.
2. Use `Command Prompt` on Windows, or `Terminal` on Mac (or any console of your choice), to navigate to the root of the repository.
3. For this step, ensure that Python is installed on your computer. If not, install using [this link](https://www.python.org/downloads/). If you have Python 2, type the following command in the console:
```
python -m SimpleHTTPServer 8888
```
Use the following command for Python 3:
```
python -m http.server 8888
```
This will host the website locally on your computer.

4. On a browser of your choice, go to `http://localhost:8888/` to view the visualization.
