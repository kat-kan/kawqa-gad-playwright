# Table of Contents

**2024-11-18_1** [Explicitly state regular user type as createHeaders() function parameter](#explicitly-state-regular-user-type)

# Decisions

## Explicitly state `regular` user type as `createHeaders()` function parameter <a id="explicitly-state-regular-user-type"></a>

### Decision: The user type in the tests has to be explicitly stated regardless of the type

**ID**: 2024-11-18_1  
**Source**: Kaw-QA meeting

### Description
The `createHeaders()` function from `src/helpers/api/create-token.helper` file has parameter with default value `regular`. Nevertheless, it would be more comprehensible (especially for new Kaw-QA contributors) to explicitly state the user type in the tests.