# -*- coding: utf-8 -*-
"""
Created on Sun Nov 23 21:39:06 2025

@author: Cameron
"""

import numpy as np
import sys
import json



if __name__ == "__main__":
    # Read JSON input from command line
    try:
        input_data = json.loads(sys.argv[1])
        
        # Call your function with the arguments
        time_range_start = 3600
        time_range_end = 7200
        hbins = np.range(3600, 7200, 30)
        counts, bins = np.histogram(times, hbins)
        result = {'counts': counts, 'bins' : bins}
        # Output result as JSON
        print(json.dumps(result))
        
    except Exception as e:
        error_result = {"error": str(e), "status": "error"}
        print("input data\n")
        print(input_data)
        print("\n")
        print("output data \n")
        print(json.dumps(error_result))
        sys.exit(1)