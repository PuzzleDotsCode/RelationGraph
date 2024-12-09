# Features of the Interactive Graph App

1. Interactive Graph Display
    * Visualizes nodes and links as an interactive graph.
    * Nodes are represented as circles with labels.
    * Links are represented as lines with optional labels.
    * Hovering over a node displays additional information, including:
        * Description: Details about the node.
        * Bullets: A list of key points related to the node.
        * Tags: Tags associated with the node.

2. Dynamic Title Management
    * Editable Title:
        * Users can edit the graph's title using an edit button.
        * The title is included in the downloadable JSON file.
        * The title is optional and does not cause errors if absent.
    * Title Updates from JSON:
        * When a JSON file with a title field is uploaded, the app automatically updates the graph's title.

3. JSON Integration
    * Default Data:
        * The app uses a default data.json file for initial graph rendering.
    * Custom File Upload:
        * Users can upload a JSON file to override the default graph data.
        * Uploaded data is stored in a browser cookie for persistence (12-hour expiration).
        * The graph title updates if the uploaded JSON includes a title field.
    * JSON Validation:
        * Ensures that missing fields do not cause app failures.
        * Supports partial data (e.g., no title or label).

4. Persistence
    * Cookie Storage:
        * The uploaded JSON is saved as a cookie (grafo_data) with a 12-hour expiration.
        * The graph restores its state automatically from the cookie upon page reload.

5. Downloadable Data
    * Clean JSON Output:
        * Users can download the current graph data as a JSON file.
        * The output excludes unnecessary fields (e.g., x, y, vx, vy, __indexColor).
        * The downloaded file includes the title and clean nodes/links structure.

6. Node and Link Customization
    * Nodes:
        * Each node includes:
            * id: Unique identifier.
            * title: Label displayed on the node.
            * description: Detailed information.
            * bullets: List of notes.
            * tags: Associated tags.
            * color: Node color.
        * Nodes are small and visually clear to avoid clutter.
    * Links:
        * Links connect nodes with optional directional arrows.
        * Labels can be displayed in the middle of links.
        * Link labels are optional and do not cause failures if absent.

7. Error Handling
    * The app ensures stability with incomplete or malformed JSON data.
    * Missing or undefined fields (e.g., title or label) do not interrupt functionality.

8. User Interface
    * Mode Selection:
        * Edit Mode: Uses the default data.json or restores data from cookies.
        * Upload Mode: Allows uploading a JSON file for custom graph data.
    * Buttons:
        * Download JSON: Saves the current graph data to a file.
        * Edit Title: Toggles title editing mode.

9. Visualization Enhancements
    * Zoom and Scale:
        * The graph supports zooming, and text sizes adjust dynamically to maintain readability.
    * Interactive Elements:
        * Nodes and links are clickable and display hover details for better exploration.
